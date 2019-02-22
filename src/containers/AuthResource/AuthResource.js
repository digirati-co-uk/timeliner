import React, {
  Component,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

function windowOpen(url) {
  return new Promise(resolve => {
    const windowRef = window.open(url);
    const check = () => {
      if (windowRef.closed) {
        clearInterval(timeout);
        resolve();
      }
    };
    const timeout = setInterval(check, 250);
  });
}

function getOrigin(url) {
  let urlHolder = window.location;
  if (url) {
    urlHolder = document.createElement('a');
    urlHolder.href = url;
  }
  return (
    urlHolder.protocol +
    '//' +
    urlHolder.hostname +
    (urlHolder.port ? ':' + urlHolder.port : '')
  );
}

export function resolveAvResource(annotation) {
  if (!annotation.body) {
    return null;
  }

  const body = Array.isArray(annotation.body)
    ? annotation.body
    : [annotation.body];

  const allBodies = body
    .filter(singleBody => {
      return (
        singleBody.type === 'Choice' ||
        singleBody.type === 'Sound' ||
        singleBody.type === 'Audio' ||
        singleBody.type === 'Video'
      );
    })
    .map(singleBody => {
      if (singleBody.type === 'Choice') {
        // Return first choice for now.
        return singleBody.items.find(choiceItem => {
          return (
            choiceItem.type === 'Sound' ||
            choiceItem.type === 'Video' ||
            singleBody.type === 'Audio'
          );
        });
      }
      return singleBody;
    })
    .filter(Boolean);

  // We only support single bodies.
  return allBodies.length ? allBodies[0] : null;
}

function openTokenService(tokenService) {
  // use a Promise across a postMessage call. Discuss...
  return new Promise((resolve, reject) => {
    // if necessary, the client can decide not to trust this origin
    // const serviceOrigin = getOrigin(tokenService['@id']);
    const iFrame = document.createElement('iframe');

    const timeout = setTimeout(() => {
      reject({ error: 'request timed out.' });
    }, 5000);

    const checkMessage = event => {
      if (
        event &&
        event.data &&
        event.data.messageId &&
        event.data.messageId === btoa(tokenService)
      ) {
        // This is in a try catch, because of react.
        try {
          if (iFrame.parentNode) {
            iFrame.parentNode.removeChild(iFrame);
          }
        } catch (e) {}
        window.removeEventListener('message', checkMessage);
        clearTimeout(timeout);
        resolve(event.data);
      }
    };

    window.addEventListener('message', checkMessage, false);

    const separator = tokenService.indexOf('?') === -1 ? '?' : '&';

    document.body.appendChild(iFrame);

    iFrame.src =
      tokenService +
      separator +
      'messageId=' +
      btoa(tokenService) +
      '&origin=' +
      getOrigin();
  });
}

export function AuthCookieService1({ service, children }) {
  const {
    confirmLabel,
    description,
    failureDescription,
    failureHeader,
    header,
    label,
  } = service || {};

  // Modal bits.
  // const confirmLabel = service.confirmLabel;
  // const description = service.description;
  // const failureDescription = service.failureDescription;
  // const failureHeader = service.failureHeader;
  // const header = service.header;
  // const label = service.label;
  // Open this dialog on click
  const authService = service ? service['@id'] : null;
  // Once we see that the window is closed, open this link
  // @todo this hack.
  const tokenService = service ? service.service[0]['@id'] : null;
  // Wait for token, save it. Not sure if logout service is needed?
  // const logoutService = service.services[1]['@id'];

  // Derived props.
  const separator = tokenService
    ? tokenService.indexOf('?') === -1
      ? '?'
      : '&'
    : '?';

  // Initial load, nothings happened.
  const INITIAL_LOAD = 0;
  // Modal is being shown to user.
  const MODAL_SHOWN = 1;
  // User has actioned the modal.
  const WAITING_FOR_LOGIN = 2;
  // User has closed popup window.
  const LOGIN_CONFIRMED = 3;
  // Waiting for token
  const WAITING_FOR_TOKEN = 4;
  // Token success.
  const AUTHENTICATED = 5;

  // Failures.
  const TOKEN_FAILED = 6;
  const LOGIN_FAILED = 7;
  const USER_OPT_OUT = 8;

  // Hooks.
  const [currentStage, setStage] = useState(INITIAL_LOAD);
  const [authToken, setAuthToken] = useState(null);

  // Change effect.
  useEffect(
    () => {
      if (currentStage === INITIAL_LOAD) {
        openTokenService(tokenService)
          .then(data => {
            if (data.accessToken) {
              setAuthToken(data.accessToken);
              setStage(AUTHENTICATED);
            } else {
              setStage(MODAL_SHOWN);
            }
          })
          .catch(() => {
            setStage(MODAL_SHOWN);
          });
      }
      // When current stage is changed to WAITING FOR LOGIN
      if (currentStage === WAITING_FOR_LOGIN) {
        windowOpen(`${authService}${separator}origin=${getOrigin()}`)
          .then(() => {
            setStage(LOGIN_CONFIRMED);
          })
          .catch(() => {
            setStage(LOGIN_FAILED);
          });
      }
      if (currentStage === LOGIN_CONFIRMED) {
        setStage(WAITING_FOR_TOKEN);
        openTokenService(tokenService)
          .then(data => {
            if (data.accessToken) {
              setAuthToken(data.accessToken);
              setStage(AUTHENTICATED);
            } else {
              setStage(TOKEN_FAILED);
            }
          })
          .catch(e => {
            setStage(TOKEN_FAILED);
          });
      }
    },
    [currentStage]
  );

  if (!service) {
    return children;
  }

  const confirmModal = () => {
    // Do stuff.
    setStage(WAITING_FOR_LOGIN);
  };

  const dismissModal = () => {
    setStage(USER_OPT_OUT);
  };

  const dismissErrorModal = () => {
    setStage(USER_OPT_OUT);
  };

  if (
    currentStage === INITIAL_LOAD ||
    currentStage === WAITING_FOR_LOGIN ||
    currentStage === WAITING_FOR_TOKEN
  ) {
    return <div>'loading...'</div>;
  }

  if (currentStage === MODAL_SHOWN) {
    return (
      <div
        style={{
          position: 'absolute',
          zIndex: 10,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,.4)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            left: '50%',
            marginLeft: -200,
            width: 400,
            top: 100,
          }}
        >
          <div style={{ background: '#fff', width: '400px', padding: 20 }}>
            <h1>{header}</h1>
            <p dangerouslySetInnerHTML={{ __html: description }} />
            <button onClick={dismissModal}>Cancel</button>
            <button onClick={confirmModal}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStage === TOKEN_FAILED || currentStage === LOGIN_FAILED) {
    return (
      <div>
        Error Modal shown
        <button onClick={dismissErrorModal}>Dismiss</button>
      </div>
    );
  }

  if (currentStage === AUTHENTICATED) {
    return children;
  }

  // User opt-out.
  return children;
}
