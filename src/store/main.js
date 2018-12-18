import { createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../reducers/root';
import rootSaga from '../sagas/index';
import importResource from '../components/AudioImporter/AudioImporter.Utils';
import { importDocument } from '../actions/project';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(wAudio, fresh = false) {
  const sagaMiddleware = createSagaMiddleware();
  const persistedReducer = persistReducer(
    {
      key: 'timeliner-root' + wAudio,
      storage,
    },
    rootReducer
  );

  const store = createStore(
    persistedReducer,
    {},
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );
  const persistor = persistStore(store);

  if (fresh) {
    persistor.purge();
  }

  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);
  store.runSaga(rootSaga);
  // @todo move this to saga.
  if (wAudio) {
    importResource(wAudio).then(manifest => {
      store.dispatch(importDocument(manifest, wAudio));
    });
  }
  return { store, persistor };
}
