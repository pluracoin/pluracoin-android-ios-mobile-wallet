// Copyright (C) 2021, PluraDev
//
// Please see the included LICENSE file for more information.

import React from 'react';

import { Animated, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export class SpinnerWaiting extends React.Component {
    constructor(props) {
        super(props);
        this.animation = new Animated.Value(0);
    }

    componentDidMount() {
        Animated.loop(
            Animated.timing(this.animation, {toValue: 1, duration: 2000, useNativeDriver: true})
            //Animated.timing(this.animation, {toValue: 1, duration: 500, useNativeDriver: true})
        ).start();
    }

    render() {
        const rotation = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
            //outputRange: ['0deg', '0deg']
        });

        return(
            <Animated.View style={{transform: [{rotate: rotation}]}}>
                <Icon
                    name='spinner'
                    type='font-awesome'
                    color='#ffffff'
                />
            </Animated.View>
        );
    }
}
