import React, { useCallback, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import ArrowForward from '@material-ui/icons/ArrowForward';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import formatDate from 'date-fns/format';

function DisplayMarker(props) {
  const { onGoToMarker } = props;
  const { label, summary, time } = props.marker;

  const onDelete = e => {
    e.preventDefault();
    e.stopPropagation();
    props.onDelete();
  };

  const timeToLabel = timeOffset => {
    if (timeOffset < 0) {
      return this.timeToLabel(0);
    }
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const date = new Date(timeOffset + timezoneOffset);
    if (date.toString() === 'Invalid Date') {
      return 'Invalid time';
    }

    const format = timeOffset >= 3600000 ? 'hh:mm:ss.SS' : 'mm:ss.SS';
    return formatDate(date, format);
  };

  return (
    <CardContent
      onClick={props.onEdit}
      style={{ cursor: 'pointer', padding: '8px 16px' }}
    >
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography inline variant="h6" component="h3">
            {label || 'Unnamed marker'}
          </Typography>
          <Typography
            inline
            variant="subtitle1"
            color="textSecondary"
            style={{ paddingLeft: 8 }}
          >
            ({timeToLabel(time)})
          </Typography>
        </Grid>
        <Grid>
          <IconButton onClick={onDelete} style={{ padding: 5 }}>
            <Delete fontSize="small" />
          </IconButton>
          <IconButton
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onGoToMarker();
            }}
            style={{ padding: 5 }}
          >
            <ArrowForward fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>

      {summary && (
        <Typography variant="subtitle1">
          <span style={{ color: '#999' }}>{summary}</span>
        </Typography>
      )}
    </CardContent>
  );
}

function CustomTextField(props) {
  return (
    <TextField
      autoFocus={false}
      InputLabelProps={{
        shrink: true,
      }}
      fullWidth
      margin="normal"
      {...props}
    />
  );
}

function EditMarker(props) {
  const [draft, setDraft] = useState(() => ({
    label: props.marker.label,
    summary: props.marker.summary,
  }));

  const onSave = useCallback(() => props.onSave(draft), [draft]);

  const handleKeyDown = useCallback(
    e => {
      if (e.target && e.target.tagName === 'TEXTAREA') {
        return;
      }
      if (e.keyCode === 13) {
        onSave();
      }
      if (e.keyCode === 27) {
        props.onCancel();
      }
    },
    [draft, onSave]
  );

  const updateDraftField = (name, type) => event =>
    setDraft({
      ...draft,
      [name]: type === 'checkbox' ? event.target.checked : event.target.value,
    });

  return (
    <form style={{ padding: 20 }} onKeyDown={handleKeyDown}>
      <CustomTextField
        id="label"
        label="Label"
        placeholder="Untitled marker"
        value={draft.label}
        onChange={updateDraftField('label')}
        autoFocus={true}
      />
      <CustomTextField
        id="summary"
        name="summary"
        label="Description"
        placeholder="Marker description"
        multiline={true}
        value={draft.summary}
        onChange={updateDraftField('summary')}
      />
      <Grid
        container
        spacing={16}
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Grid
          item
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: '1 1 0px',
          }}
        >
          <Button onClick={props.onCancel}>Cancel</Button>
          <PrimaryButton disabled={!props.onSave} onClick={onSave}>
            Save
          </PrimaryButton>
        </Grid>
      </Grid>
    </form>
  );
}

export default function MarkerMetadata(props) {
  const [isEditing, setIsEditing] = useState();
  const {
    marker,
    onSaveMarker,
    onDeleteMarker,
    highlight,
    onGoToMarker,
  } = props;

  return (
    <Card
      style={{
        marginLeft: `${props.inset * 24}px`,
        marginBottom: 8,
        borderLeft: highlight
          ? '5px solid rgb(63, 81, 181, .5)'
          : '0px solid transparent',
        transition: 'border .3s',
      }}
    >
      {isEditing ? (
        <EditMarker
          marker={marker}
          onSave={draft => {
            onSaveMarker(draft);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <DisplayMarker
          marker={marker}
          onDelete={onDeleteMarker}
          onEdit={() => setIsEditing(true)}
          onGoToMarker={onGoToMarker}
        />
      )}
    </Card>
  );
}
