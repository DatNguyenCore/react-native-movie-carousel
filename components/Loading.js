import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';

function Loading(props) {
    return (
        <View style={styles.container}>
            <StatusBar hidden></StatusBar>
            <Text style={styles.text}>Loading...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#444',
        fontWeight: 'bold',
        fontSize: 25
    }
})

export default Loading;