import React, { useEffect, useState } from 'react';
import AuthModal from '../../components/AuthModal/AuthModal';

function log(...args) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
}

function probeResource(url) {
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    http.open('HEAD', url);
    http.onreadystatechange = () => {
      if (http.readyState === http.DONE) {
        if (http.status >= 300 && http.status <= 499) {
          reject();
        } else {
          resolve();
        }
      }
    };
    http.send();
  });
}

function logStage(stage, ...args) {
  const stages = [
    // Initial load, nothings happened.
    'INITIAL_LOAD',
    // Modal is being shown to user.
    'MODAL_SHOWN',
    // User has actioned the modal.
    'WAITING_FOR_LOGIN',
    // User has closed popup window.
    'LOGIN_CONFIRMED',
    // Waiting for token
    'WAITING_FOR_TOKEN',
    // Token success.
    'AUTHENTICATED',

    // Failures.
    'TOKEN_FAILED',
    'LOGIN_FAILED',
    'USER_OPT_OUT',
  ];
  return log(stages[stage], ...args);
}

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

export function AuthCookieService1({ service, resource, children }) {
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
  const tokenServiceObject = service
    ? (service.service || []).find(
        embeddedService =>
          embeddedService.profile === 'http://iiif.io/api/auth/1/token'
      )
    : null;
  const tokenService = tokenServiceObject
    ? tokenServiceObject.id || tokenServiceObject['@id']
    : null;

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
  const [currentStage, setStageInner] = useState(INITIAL_LOAD);
  const [authToken, setAuthToken] = useState(null);

  const setStage = stage => {
    logStage(stage, 'setting stage');
    setStageInner(stage);
  };

  // Change effect.
  useEffect(() => {
    if (currentStage === INITIAL_LOAD && resource) {
      log('Probing current resource', resource);
      probeResource(resource)
        .then(() => {
          if (!tokenService) {
            // Nothing more we can do at this point.
            return;
          }
          log('Opening token service', tokenService);
          openTokenService(tokenService)
            .then(data => {
              if (data.accessToken) {
                setAuthToken(data.accessToken);
                setStage(AUTHENTICATED);
              } else {
                log('No access token on token service', data);
                setStage(MODAL_SHOWN);
              }
            })
            .catch(() => {
              log('Token service errored');
              setStage(MODAL_SHOWN);
            });
        })
        .catch(() => {
          log('Probing resource errored');
          setStage(MODAL_SHOWN);
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
        .catch(() => {
          setStage(TOKEN_FAILED);
        });
    }
  }, [currentStage]);

  if (!service) {
    return children;
  }

  const confirmModal = () => {
    setStage(WAITING_FOR_LOGIN);
    windowOpen(`${authService}${separator}origin=${getOrigin()}`)
      .then(() => {
        log('Window closed, user should be active.');
        setStage(LOGIN_CONFIRMED);
      })
      .catch(() => {
        setStage(LOGIN_FAILED);
      });
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
      <AuthModal
        header={header}
        description={description}
        confirmLabel={confirmLabel}
        onConfirm={confirmModal}
        onDismiss={dismissModal}
      />
    );
  }

  if (currentStage === TOKEN_FAILED || currentStage === LOGIN_FAILED) {
    return (
      <AuthModal
        header={failureHeader || 'Something went wrong'}
        description={failureDescription || ''}
        confirmLabel={'Refresh page'}
        onConfirm={() => window.location.reload(true)}
        dismissLabel="Continue without authentication"
        onDismiss={dismissErrorModal}
      />
    );
  }

  if (currentStage === AUTHENTICATED) {
    return children;
  }

  // User opt-out.
  return children;
}
