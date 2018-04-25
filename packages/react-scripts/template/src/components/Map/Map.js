import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { mapActions } from '../Map';

import './map.css';

type Props = {
    init: () => void
};

/**
 * Map widget: display map
 * @memberof module:Map
 * @class
 * @extends React.Component
 */
class Map extends React.Component {
    constructor(props: Props) {
        super(props);
    }

    /**
     * Initialize map
     */
    componentDidMount() {
        console.log("componentDidMount")
        this.props.init();
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
    init: () => dispatch(mapActions.init())
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);
