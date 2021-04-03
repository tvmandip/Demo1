import React, { Component } from 'react';
import { StyleSheet, View, Text, Modal, ActivityIndicator } from 'react-native';

const Loader = (props) => {
    const { loading, color, ...attributes } = props;

    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={loading}
            onRequestClose={() => { }}>
            <View style={styles.modalBackground}>
                <View style={[styles.activityIndicatorWrapper, { height: 90 }]}>
                    <ActivityIndicator
                        size="large"
                        animating={loading}
                        color={color ? color : "blue"}
                    />
                    <View>
                        <Text
                            style={{
                                textAlign: 'center',
                                color: "#000",
                            }}>
                            Loading
            </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});

export default Loader;
