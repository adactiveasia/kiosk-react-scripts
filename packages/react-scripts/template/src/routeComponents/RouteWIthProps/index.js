// @flow

import * as React from 'react';
import type { Element, ComponentType } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import type { AppStateType } from '../../rootReducer';

type PropsType = {
    component: ComponentType<*>
};

const RouteWithProps = ({ component: Component, ...rest }: PropsType): Element<typeof Route> => (
    <Route
        {...rest}
        render={(): Element<typeof Component> => (
            <Component {...rest} />
        )}
    />
);

const mapStateToProps = (state: AppStateType) => ({
    location: state.routing.location
});

export default connect(
    mapStateToProps,
    null
)(RouteWithProps);

