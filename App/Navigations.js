import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/Home'
import Login from './src/Login'
import Welcome from './src/Welcome';


const Stack = createStackNavigator();

export default function Navigations() {
    return (
        <NavigationContainer >
            <Stack.Navigator headerMode={'none'}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Welcome" component={Welcome} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
