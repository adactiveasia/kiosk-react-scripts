// @flow

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { mapActions } from '../Map';

import './map.css';

import type { AppState } from "../../rootReducer";
import type { MapState } from "./initialState";

type MappedStateProps = {|
  mapState: MapState
|};
type MappedDispatchProps = {|
  init: () => void,
  changeFloor: () => void,
|};
type OwnProps = {||};
type Props = MappedStateProps & MappedDispatchProps & OwnProps;
/**
 * Map widget: display map
 * @memberof module:Map
 * @class
 * @extends React.Component
 */
class Map extends React.Component<Props> {
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

const mapStateToProps = (state: AppState): MappedStateProps => ({
  mapState: state.map.state
});

const mapDispatchToProps = (dispatch): MappedDispatchProps => bindActionCreators({
  init: () => dispatch(mapActions.init()),
  changeFloor: () => dispatch(mapActions.changeFloor(1)),
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
