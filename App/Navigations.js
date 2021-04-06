import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './src/Screens/Login'
import Welcome from './src/Screens/Welcome';
import { connect } from 'react-redux';
import EditUser from './src/Screens/EditUser';


const Stack = createStackNavigator();

class Navigations extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log("state:::", this.props.AppReducer)
    }
    render() {
        return (
            <NavigationContainer >
                <Stack.Navigator headerMode={'none'} initialRouteName={this.props.AppReducer ? "Welcome" : "Login"}>
                    <Stack.Screen name="Edit" component={EditUser} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Welcome" component={Welcome} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

const mapStateToProps = (state) => ({
    AppReducer: state.AppReducer.test,
});

export default connect(mapStateToProps)(Navigations);