// @flow

import * as React from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';

import AdsumCarousel from '@adactive/arc-carousel';

import CarouselArrow from '../../components/CarouselArrow';
import type { AppStateType } from '../../rootReducer';

type PropsType = {
    medias: Array<Object>,
    width: number,
    height: number
};

const RouteWithCarousel = ({ medias, width, height }: PropsType): Element<typeof AdsumCarousel> => {
    const sizes = {
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: 'black'
    };

    const arrowStyle = {
        opacity: '0.8'
    };

    const renderCenterLeftControls = ({ previousSlide }) => (
        <CarouselArrow
            onArrowClicked={previousSlide}
            direction="left"
            arrowStyle={arrowStyle}
        />
    );

    const renderCenterRightControls = ({ nextSlide }) => (
        <CarouselArrow
            onArrowClicked={nextSlide}
            direction="right"
            arrowStyle={arrowStyle}
        />
    );

    const carouselOptions = {
        dragging: false,
        swiping: false,
        speed: 1000,
        autoplayInterval: 5000,
        renderCenterLeftControls,
        renderCenterRightControls,
        renderCenterBottomControls: null,
        renderBottomCenterControls: null,
        pauseOnHover: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        wrapAround: true
    };

    return (
        <AdsumCarousel
            isOpen
            medias={medias}
            onMediaTouch={(media) => {
                console.log(media);
            }}
            style={sizes}
            carouselOptions={carouselOptions}
        />
    );
};

const mapStateToProps = (state: AppStateType) => ({
    location: state.routing.location
});

export default connect(
    mapStateToProps,
    null
)(RouteWithCarousel);
