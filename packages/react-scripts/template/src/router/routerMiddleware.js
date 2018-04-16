import { routerMiddleware } from 'react-router-redux';
import history from './history';

const routerMiddlewareWithHistory = routerMiddleware(history);

export default routerMiddlewareWithHistory;
