import { combineReducers } from 'redux'
import productsReducer from './products';
import billReducer from './bill';

export default combineReducers({
    products:productsReducer,
    bills:billReducer
})

// export default products;