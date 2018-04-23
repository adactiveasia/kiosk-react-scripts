import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import map from './components/Map/MapReducers'

export default combineReducers({
    routing: routerReducer,
    map
})
