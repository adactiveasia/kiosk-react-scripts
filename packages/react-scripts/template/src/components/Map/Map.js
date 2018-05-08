// @flow

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { mapActions } from '../Map';

import './map.css';

import type { AppStateType } from '../../rootReducer';
import type { MapStateType } from './initialState';

type MappedStatePropsType = {|
    mapState: MapStateType
|};
type MappedDispatchPropsType = {|
    init: () => void,
    changeFloor: () => void
|};
type OwnPropsType = {||};
type PropsType = MappedStatePropsType & MappedDispatchPropsType & OwnPropsType;
/**
 * Map widget: display map
 * @memberof module:Map
 * @class
 * @extends React.Component
 */
class Map extends React.Component<PropsType> {
    /**
     * Initialize map
     */
    componentDidMount() {
        this.props.init();
    }

    render() {
        return (
            <div className="map-wrapper">
                <div id="adsum-web-map-container" />
            </div>
        );
    }
}

const mapStateToProps = (state: AppStateType): MappedStatePropsType => ({
    mapState: state.map.state
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => bindActionCreators({
    init: (): void => dispatch(mapActions.init()),
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);
