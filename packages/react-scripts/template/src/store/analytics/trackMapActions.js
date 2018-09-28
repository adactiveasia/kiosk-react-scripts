// @flow

import { WayfindingActions } from '@adactive/arc-map';
import { DefaultSchemaHelper, Tracker } from '@adactive/adsum-client-analytics';
import { ClientAPI as ACA } from '@adactive/adsum-utils';

const trackMapActions = (tracker: Tracker, store, action) => {
    switch (action.type) {
    case WayfindingActions.types.WILL_DRAW_TO_POI: {
        const poi = ACA.getPoi(action.poiId);
        if (poi !== null) {
            tracker.add(
                DefaultSchemaHelper.getPoiType(),
                DefaultSchemaHelper.getPoiEvent(
                    'goTo',
                    poi,
                ),
            );
        }
        break;
    }
    case WayfindingActions.types.DID_DRAW: {
        const place = ACA.getPlace(action.placeId);
        if (place !== null) {
            tracker.add(
                DefaultSchemaHelper.getPlaceType(),
                DefaultSchemaHelper.getPlaceEvent(
                    'goTo',
                    place,
                ),
            );
        }
        break;
    }
    default:
    }
};

export default trackMapActions;
