import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './map.css';

import { mapActions } from '../Map';

type Props = {
    init: () => void
};

const Map = (props: Props) => (
    <div className="map-wrapper">
        <div id="adsum-web-map-container"></div>
    </div>
);

const mapDispatchToProps = dispatch => bindActionCreators({
    init: () => dispatch(mapActions.init())
}, dispatch);

export default connect(
    null,
    mapDispatchToProps
)(Map);
