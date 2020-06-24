import {createStore,applyMiddleware} from 'redux'
import reducer from '../reducers'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'

// const initalState = {products:[]}
const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
  });

export const store = createStore(
    reducer,
    // initalState,
    composeEnhancers(
        applyMiddleware(thunk),
    )
    
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    )