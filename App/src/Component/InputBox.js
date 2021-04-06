import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default class InputBox extends Component {
    render() {
        return (
            <View style={[styles.InputBox_container, this.props.InputBox_container]}>
                <TextInput
                    value={this.props.value}
                    placeholderTextColor={this.props.placeholderTextColor}
                    keyboardType={this.props.keyboardType}
                    onChangeText={this.props.onChangeText}
                    placeholder={this.props.placeholder}
                    secureTextEntry={this.props.secureTextEntry}
                    style={[{ flex: 1, height: 50 }, this.props.textInputStyle]}
                    maxLength={this.props.maxLength}
                    autoCapitalize={this.props.autoCapitalize}
                    editable={this.props.editable}
                />

                <View style={styles.hideShowView}>
                    <TouchableOpacity onPress={this.props.onPress}>
                        <Image source={{ uri: this.props.IMG }}
                            resizeMethod="resize"
                            style={styles.hideShowImg} />
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    InputBox_container: {
        width: 300,
        marginHorizontal: 16,
        borderColor: '#E2E2E2',
        marginVertical: 10,
        borderWidth: 1,
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 6,
        flexDirection: 'row',
    },
    hideShowView: {
        flex: 0.2,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: 'blue'
    },

    hideShowImg: {
        height: 25,
        width: 25,
        resizeMode: "contain"
    },
})