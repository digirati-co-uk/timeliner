import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import rootReducer from '../reducers/root';
import rootSaga from '../sagas/index';
import importResource from '../components/AudioImporter/AudioImporter.Utils';
import { importDocument } from '../actions/project';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(wAudio) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer,
    {},
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );
  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);
  store.runSaga(rootSaga);
  if (wAudio) {
    importResource(wAudio).then(manifest => {
      store.dispatch(importDocument(manifest));
    });
  }
  return store;
}
