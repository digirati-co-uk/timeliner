import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import rootReducer from '../reducers/root';
import rootSaga from '../sagas/index';
import importResource from '../components/AudioImporter/AudioImporter.Utils';
import { importDocument } from '../actions/project';

export default function configureStore(wAudio) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(sagaMiddleware)
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
