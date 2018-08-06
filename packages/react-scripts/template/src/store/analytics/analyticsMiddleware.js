import { Tracker } from '@adactive/adsum-client-analytics';
import trackMapActions from './trackMapActions';
import config from '../../services/Config';

let tracker = null;

config.init().then(() => {
    tracker = new Tracker(Object.assign({}, config.config.analytics, { endpoint: '/analytics' }));
    tracker.start(200);
});

const analyticsMiddleware = store => next => (action) => {
    if (tracker === null) {
        console.warn(`Analytics tracker is not ready, action "${action.type}" will not be record`);

        return next(action);
    }
    trackMapActions(tracker, store, action);

    return next(action);
};

export default analyticsMiddleware;
