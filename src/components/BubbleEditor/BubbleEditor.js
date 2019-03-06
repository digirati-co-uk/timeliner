import React from 'react';
import Measure from 'react-measure';
import './BubbleEditor.scss';

const COLOURS = ['#F79F1F', '#A3CB38', '#0652DD', '#9980FA', '#EA2027'];

const DEMO_POINTS = {
  'id-1': {
    id: 'id-1',
    from: 0,
    to: 60000,
    depth: 1,
    label: 'Composition',
    summary: 'some summary',
    isSelected: false,
    colour: 1,
  },
};

const getRelativeCoordinates = e => {
  const pos = {};
  const offset = {};
  let ref;

  ref = e.target;

  pos.x = !!e.touches ? e.touches[0].pageX : e.pageX;
  pos.y = !!e.touches ? e.touches[0].pageY : e.pageY;

  offset.left = e.target.offsetLeft;
  offset.top = e.target.offsetTop;

  while (ref) {
    offset.left += ref.offsetLeft;
    offset.top += ref.offsetTop;
    ref = ref.offsetParent;
  }

  return {
    x: pos.x - offset.left,
    y: pos.y - offset.top,
  };
};

class BubbleDisplay extends React.Component {
  static defaultProps = {
    editorWidth: 700,
    bubbleStepHeight: 70,
  };
  constructor(props) {
    super(props);
    this.state = {
      bubbles: props.bubbles,
      runTime: Math.max.apply(
        null,
        Object.values(props.bubbles).map(bubble => bubble.to)
      ),
      maxDepth: Math.max(
        6,
        Math.max.apply(
          null,
          Object.values(props.bubbles).map(bubble => bubble.depth)
        )
      ),
      selectedPoint: -1,
      startX: 0,
      deltaX: 0,
    };
  }

  toggleBubbleSelect = bubbleId => {
    const bubbles = this.getBubbles();
    return ev => {
      if (ev.shiftKey) {
        const selectedBubbles = bubbles.filter(bubble => bubble.isSelected);
        if (selectedBubbles.length > 0) {
          let firstSelected;
          let lastSelected;
          if (selectedBubbles[0].from > this.state.bubbles[bubbleId].from) {
            firstSelected = selectedBubbles[0];
            lastSelected = this.state.bubbles[bubbleId];
          } else {
            lastSelected = selectedBubbles[0];
            firstSelected = this.state.bubbles[bubbleId];
          }
          bubbles.forEach(bubble => {
            bubble.isSelected =
              bubble.from <= firstSelected.from &&
              bubble.to >= lastSelected.to &&
              bubble.depth <= Math.max(firstSelected.depth, lastSelected.depth);
          });
          this.forceUpdate();
          return;
        }
      }
      bubbles.forEach(bubble => {
        bubble.isSelected = bubbleId === bubble.id ? !bubble.isSelected : false;
      });
      this.forceUpdate();
    };
  };

  onTimelineClick = ev => {
    if (this.state.selectedPoint < 0) {
      const splitPoint =
        (getRelativeCoordinates(ev).x / this.props.editorWidth) *
        this.state.runTime;
      this.splitAtPoint(splitPoint);
    }
  };

  splitAtPoint = splitPoint => {
    const bubbleToSplit = Object.values(this.state.bubbles)
      .filter(bubble => bubble.from <= splitPoint && bubble.to >= splitPoint)
      .reduce(
        (smallestBubble, bubble) => {
          return smallestBubble.to - smallestBubble.from >=
            bubble.to - bubble.from
            ? bubble
            : smallestBubble;
        },
        { from: 0, to: this.state.runTime }
      );
    const newBubble = JSON.parse(JSON.stringify(bubbleToSplit));
    bubbleToSplit.to = splitPoint;
    newBubble.from = splitPoint;
    newBubble.id = `id-${new Date().getTime()}`;

    newBubble.label = '';
    newBubble.summary = '';
    newBubble.isSelected = false;
    this.state.bubbles[newBubble.id] = newBubble;
    this.setState({
      bubbles: this.state.bubbles,
    });
  };

  dragStart = ev => {
    if (
      ev.target === ev.target.parentNode.firstChild ||
      ev.target === ev.target.parentNode.lastChild
    ) {
      return;
    }
    const selectedPoint = Array.prototype.indexOf.call(
      ev.target.parentNode.childNodes,
      ev.target
    );

    document.body.addEventListener('mousemove', this.dragMove);
    document.body.addEventListener('mouseup', this.dragEnd);
    this.setState({
      selectedPoint: selectedPoint,
      startX: ev.clientX,
      deltaX: 0,
    });
  };

  clearTextSelection = () => {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      // IE?
      document.selection.empty();
    }
  };

  dragMove = ev => {
    if (this.state.selectedPoint < 0) {
      return;
    }
    // in order to smooth drag
    this.clearTextSelection();
    this.setState({
      deltaX: ev.clientX - this.state.startX,
    });
  };

  getBubbles = () =>
    Object.values(this.state.bubbles).sort((b1, b2) => {
      return b2.depth - b1.depth === 0
        ? b1.from - b2.from
        : b2.depth - b1.depth;
    });

  getPoints = () =>
    Array.from(
      this.getBubbles().reduce((_points, bubble) => {
        _points.add(bubble.from);
        _points.add(bubble.to);
        return _points;
      }, new Set([]))
    ).sort((p1, p2) => p1 - p2);

  updateSelectedPoint = () => {
    const { editorWidth } = this.props;
    const { runTime, selectedPoint, deltaX } = this.state;

    const bubblesList = this.getBubbles();
    const points = this.getPoints();
    const selectedPointValue = points[selectedPoint];
    points[selectedPoint] += Math.max((deltaX / editorWidth) * runTime);
    points[selectedPoint] = Math.max(
      points[selectedPoint],
      points[selectedPoint - 1]
    );
    points[selectedPoint] = Math.min(
      points[selectedPoint],
      points[selectedPoint + 1]
    );
    const substituteValue = points[selectedPoint];
    bubblesList.forEach(bubble => {
      if (bubble.from === selectedPointValue) {
        bubble.from = substituteValue;
      }
      if (bubble.to === selectedPointValue) {
        bubble.to = substituteValue;
      }
    });
  };

  dragEnd = ev => {
    if (this.state.selectedPoint !== -1) {
      document.body.removeEventListener('mousemove', this.dragMove);
      document.body.removeEventListener('mouseup', this.dragEnd);
      this.updateSelectedPoint();
    }
    this.setState({
      selectedPoint: -1,
    });
  };

  groupSelected = e => {
    const newGroup = this.getBubbles().reduce(
      (newBubble, bubble) => {
        if (bubble.isSelected) {
          newBubble.from = Math.min(bubble.from, newBubble.from);
          newBubble.to = Math.max(bubble.to, newBubble.to);
          newBubble.depth = Math.max(newBubble.depth, bubble.depth);
        }
        return newBubble;
      },
      {
        id: `id-${new Date().getTime()}`,
        label: '',
        summary: '',
        depth: 0,
        from: Number.MAX_SAFE_INTEGER,
        to: Number.MIN_SAFE_INTEGER,
      }
    );
    newGroup.depth += 1;
    newGroup.colour = newGroup.depth % COLOURS.length;

    Object.values(this.state.bubbles).forEach(bubble => {
      if (
        bubble.from <= newGroup.from &&
        bubble.to >= newGroup.to &&
        bubble.depth >= newGroup.depth
      ) {
        bubble.depth += 1;
        bubble.colour = (bubble.colour + 1) % COLOURS.length;
      }
    });
    this.state.bubbles[newGroup.id] = newGroup;

    this.forceUpdate();
  };

  deleteSelected = e => {};

  render() {
    const { editorWidth, bubbleStepHeight } = this.props;
    const { bubbles, runTime, maxDepth, selectedPoint, deltaX } = this.state;
    const bubblesList = this.getBubbles();
    const points = this.getPoints();

    let selectedPointValue = 0;
    let substituteValue = 0;
    if (selectedPoint !== -1) {
      selectedPointValue = points[selectedPoint];
      points[selectedPoint] += Math.max((deltaX / editorWidth) * runTime);
      points[selectedPoint] = Math.max(
        points[selectedPoint],
        points[selectedPoint - 1]
      );
      points[selectedPoint] = Math.min(
        points[selectedPoint],
        points[selectedPoint + 1]
      );
      substituteValue = points[selectedPoint];
    }
    const selectedBubbles = bubblesList.filter(bubble => bubble.isSelected);
    const selectedBubble =
      selectedBubbles.length > 0 ? selectedBubbles[0] : null;

    return (
      <div
        style={{
          width: editorWidth,
        }}
      >
        <div
          style={{
            width: editorWidth,
            height: (maxDepth + 1) * 70,
          }}
          className="bubbles"
        >
          <svg
            width={editorWidth}
            height={(maxDepth + 1) * 70}
            viewBox={[0, 0, editorWidth, (maxDepth + 1) * 70].join(',')}
            style={{
              verticalAlign: 'top',
              display: 'block',
            }}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
          >
            <g
              style={{
                transform: 'scale(1, -1)',
                transformOrigin: '50% 50%',
              }}
            >
              {bubblesList.map(bubble => {
                const from =
                  selectedPoint && bubble.from === selectedPointValue
                    ? substituteValue
                    : bubble.from;
                const to =
                  selectedPoint && bubble.to === selectedPointValue
                    ? substituteValue
                    : bubble.to;
                const x = (from / runTime) * editorWidth;
                const width = ((to - from) / runTime) * editorWidth;
                const height = bubble.depth * bubbleStepHeight;
                const d = `M${x},0a${width / 2},${height} 0 0,0 ${width},0`;
                const colour = COLOURS[bubble.colour % COLOURS.length];
                const labelColour = '#000';
                const label = bubble.label;
                return (
                  <g onClick={this.toggleBubbleSelect(bubble.id)}>
                    <path
                      d={d}
                      fill={colour}
                      stroke={bubble.isSelected ? 'black' : 'transparent'}
                      strokeWidth="2.0"
                    />

                    <text
                      textAnchor="middle"
                      fill={labelColour}
                      stroke="#fff"
                      strokeWidth="1.9"
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      paintOrder="stroke"
                      x={width / 2 + x}
                      y={0}
                      transform={`scale(1,-1) translate(0,${-height +
                        bubbleStepHeight / 2})`}
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
        <div
          className="timeline"
          onDoubleClick={this.onTimelineClick}
          title="double click to split at this point"
        >
          {points.map((point, index) => (
            <div
              className="point-marker"
              style={{
                left: (point / runTime) * editorWidth,
                backgroundColor: selectedPoint === index ? 'red' : '',
              }}
              onMouseDown={e =>
                this.dragStart({ type: 'point-marker', point, index }, e)
              }
              // onClick={ev => ev.stopPropagation()}
            />
          ))}
        </div>
        <div>
          <button
            className="btn"
            disabled={(() => {
              if (selectedBubbles.length < 2) {
                return true;
              }
              const selectedMinMax = selectedBubbles.reduce(
                (minMax, bubble) => {
                  minMax.from = Math.min(minMax.from, bubble.from);
                  minMax.to = Math.min(minMax.to, bubble.to);
                  return minMax;
                },
                { from: Number.MAX_SAFE_INTEGER, to: Number.MIN_SAFE_INTEGER }
              );
              const numberOfIntervals = bubblesList.filter(
                bubble =>
                  bubble.from === selectedMinMax.from &&
                  bubble.to === selectedMinMax.to
              ).length;

              return numberOfIntervals > 0;
            })()}
            onClick={this.groupSelected}
          >
            Group Selected
          </button>
        </div>
        <pre style={{ textAlign: 'left' }}>
          {window.JSON.stringify(bubbles, null, 2)}
        </pre>
      </div>
    );
  }
}

/**
 * @deprecated
 */
class BubbleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: {
        width: -1,
        height: -1,
      },
    };
  }
  render() {
    return (
      <div className="App">
        <Measure
          bounds
          onResize={contentRect => {
            this.setState({ dimensions: contentRect.bounds });
          }}
        >
          {({ measureRef }) => (
            <div ref={measureRef}>
              <BubbleDisplay
                bubbles={DEMO_POINTS}
                editorWidth={this.state.dimensions.width}
              />
            </div>
          )}
        </Measure>
      </div>
    );
  }
}

export default BubbleEditor;
