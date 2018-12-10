import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../reducers/root';
import rootSaga from '../sagas/index';
import importResource from '../components/AudioImporter/AudioImporter.Utils';
import { importDocument } from '../actions/project';

const persistConfig = {
  key: 'timeliner-root',
  storage,
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore(wAudio) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    persistedReducer,
    {},
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );
  const persistor = persistStore(store);
  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);
  store.runSaga(rootSaga);
  if (wAudio) {
    importResource(wAudio).then(manifest => {
      store.dispatch(importDocument(manifest));
    });
  }
  return { store, persistor };
}
