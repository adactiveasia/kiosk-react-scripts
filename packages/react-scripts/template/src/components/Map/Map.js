import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { mapActions } from '../Map';

import './map.css';

/**
 * Map widget: display map
 * @memberof module:Map
 * @class
 * @extends React.Component
 */
class Map extends React.Component {
    /**
     * Initialize map
     */
    componentDidMount() {
        this.props.init();
    }

    componentDidUpdate() {

    }

    render() {
        return (
            <div className="map-wrapper">
                <div id="adsum-web-map-container"></div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    mapState: state.map.state,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    init: () => dispatch(mapActions.init()),
    changeFloor: () => dispatch(mapActions.changeFloor(1)),
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);
