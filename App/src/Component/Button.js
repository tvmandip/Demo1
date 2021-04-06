import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class Button extends Component {
    render() {
        return (
            <View style={[styles.buttoncontainer, this.props.buttoncontainer]}>
                <TouchableOpacity onPress={this.props.onPress} disabled={this.props.disabled} activeOpacity={this.props.activeOpacity}>
                    <View style={[styles.buttonview, this.props.buttonview]}>
                        <Text style={[styles.buttontxt, this.props.buttontxt]}>{this.props.BtnName}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttoncontainer: {
        // justifyContent: 'center',
        marginVertical: 10,
        alignSelf: 'center',
        // alignItems: 'center',
    },

    buttonview: {
        backgroundColor: '#29abe2',
        borderRadius: 5,
        minWidth: '70%',
        maxWidth: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttontxt: {
        fontSize: 12,
        color: 'white',
        paddingVertical: 15,
        fontWeight: 'bold'
    },
})