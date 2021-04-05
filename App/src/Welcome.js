import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { connect } from 'react-redux';
import { isLogin, logout, testAction, userInfo } from './Redux/Actions/Actions'
import { GoogleSignin } from '@react-native-community/google-signin';
import { LoginManager } from 'react-native-fbsdk';


class Welcome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: false,
            userDetails: [],
            userLists: [],
            model: false,
            name: '',
            email: "",
            id: '',
            pic: ''
        }
    };
    componentDidMount() {
        console.log("propsss:::::::::::", this.props.AppReducer)
        this.props.AppReducer.length === 0 || this.props.AppReducer.id === undefined ?
            this.getUserInfo()
            : this.setState({ userDetails: this.props.AppReducer, name: this.props.AppReducer.name, email: this.props.AppReducer.email, id: this.props.AppReducer.id, pic: this.props.AppReducer.profileImg })
    }

    getUserInfo() {
        // if (this.props.AppReducer.length === 0) {
        try {
            database()
                .ref("users")
                .on("value", (dataSnapshot) => {
                    let users = [];
                    let currentUser = {
                        id: "",
                        name: "",
                        profileImg: "",
                        email: "",
                    };
                    dataSnapshot.forEach((child) => {
                        if (this.props.route.params.data.toLowerCase() == child.val().email.toLowerCase()) {
                            currentUser.id = child.val().userid;
                            currentUser.name = child.val().name;
                            currentUser.email = child.val().email;
                            currentUser.profileImg = child.val().pic;
                        } else {
                            users.push({
                                id: child.val().userid,
                                name: child.val().name,
                                profileImg: child.val().pic,
                                email: child.val().email,
                            });
                        }
                    });
                    // setUser(currentUser);

                    this.setState({ userDetails: currentUser });
                    this.setState({ email: currentUser.email, name: currentUser.name, id: currentUser.id, pic: currentUser.profileImg })
                    this.props.setUserInfo(currentUser)

                    // setUserList(users);
                    console.log("User ", currentUser);
                    // console.log("UserList ", users);
                });
        } catch (error) {
            alert(error);
        }
        // }
        //  else {
        //     this.setState({ userInfo: this.props.AppReducer })
        // }
    }

    userUpdate = (name, email) => {
        try {
            const res = database().ref(`/users`).child(this.state.id).update({ name, email })
            this.setState({ model: false })
            console.log("resss update", res)
        } catch (error) {
            console.log("err", error)
        }

    }

    logout = async () => {

        this.props.setUserInfo([])
        this.props.setIsLogin(false)
        auth()
            .signOut()
            .then(() => console.log('User signed out!'));
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            LoginManager.logOut();
        } catch (error) {
            console.error(error);
        }
        this.props.setLogout();
        this.props.navigation.navigate('Login');

    }
    renderSeparator = () => (
        <View
            style={{
                backgroundColor: 'black',
                height: 0.5,
            }}
        />
    );




    render() {
        const { userDetails, userLists, name, email, id, pic } = this.state;
        console.log("user details", userDetails)
        return (
            <View style={styles.container}>
                <View style={[styles.header, { backgroundColor: "#dfdfff" }]}>
                    {userDetails != null ?
                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <Image
                                    style={styles.avatar}
                                    source={{ uri: userDetails.profileImg }}
                                />
                            </View>
                            <View style={{ justifyContent: 'center', left: '50%', left: 120, top: 40 }}>
                                <Text style={styles.name}>{userDetails.name}</Text>
                                <Text style={styles.description}>{userDetails.email}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => { this.props.navigation.navigate("Edit", { data: userDetails }) }}
                                // onPress={() => { alert("dfdfvf") }}
                                style={{ position: 'absolute', right: 30, top: 30 }}
                            >
                                <Image style={{ height: 30, width: 30 }} source={{ uri: 'https://img.icons8.com/nolan/40/000000/edit.png' }} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { this.logout() }}
                                style={{ position: 'absolute', right: 30, top: 80 }}
                            >
                                <Image style={{ height: 30, width: 30 }} source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4w1cvn4cMJPTOcZQyz-Ljj1LA7sBf1HDpVg&usqp=CAU' }} />
                            </TouchableOpacity>

                        </View>
                        : null}
                </View>

                <View style={styles.body}>
                    <FlatList
                        data={userLists}
                        keyExtractor={(item) => {
                            return item.id;
                            console.log(item.id)
                        }}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ flexDirection: 'row', padding: 5 }}>
                                    <View style={{ padding: 5 }}>
                                        <Image
                                            style={{ height: 50, width: 50, borderRadius: 50, }}
                                            source={{ uri: item.profileImg }}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        // onPress={() => { navigation.navigate('Chat', { name: User.name, rname: item.name, rid: item.id, sid: User.id }) }}
                                        style={{ padding: 5 }}
                                    >
                                        <Text style={{ fontSize: 15 }}>{item.name}</Text>
                                        <Text style={{ width: '100%', fontSize: 12 }}>{item.email}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                        ItemSeparatorComponent={this.renderSeparator()}
                    />
                </View>
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={this.state.model}
                    onRequestClose={() => { }}>
                    <View style={styles.modalBackground}>
                        <View style={[styles.EditUserWraper]}>
                            {/* <ActivityIndicator
                        size="large"
                        animating={loading}
                        color={color ? color : "blue"}
                    /> */}
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            alignSelf: 'center',
                                            color: "#000",
                                            left: 30
                                        }}>
                                        Edit User details
                                </Text>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ model: !this.state.model }) }}
                                        style={{ position: 'absolute', right: 30, }}
                                    >
                                        <Image style={{ height: 30, width: 30 }} source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAV1BMVEX///8jHyAAAAAJAAALAAMNBAdoZmdiYGFmZGRta2sFAABpZ2hwbm8YExRbWFlhXl+dnJweGhsTDQ/T09O0s7M2MzNMSUqHhYbFxMWWlJQXEhNWVFRzcnIz5JTBAAAEQklEQVR4nO2d63aqMBCFBUVEpFatWtu+/3MeKeUUJbsEGEgya3+/XbMyzhWSDIsFIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIEeR026X59X0i6e/XLN3dThNJt+F0iZOPojjG57cJpL+d42NRfCTxxZmOr3ERVRzijbj0dXz4kV7Er+LSrXiNo19WL8LSX1YN6W5UPDUVjKJkLyp9nzxIj1046qWIplPxScGouAgKt+TJhKWKn2LCP5Nn4Q6MeGstQs6KzxYsZd+EZNuzK1qriJJURPSmrWD0sRMR3YfUoGGUSGRUgwXvgSjz5/UhM2kooeKLScGoyATW3I/r0bSQ8Y5qctE7x6vIqvvw3sqlIioCBaN4qt73D84H81pGdTcPnUyDw1ls3fa8ASOOsWIKFIziKVr7TtZoOcnQNhy5aLRai67cGnPWG27FFMqTbuvHL2lQLKIYlG7qe2Eszt8q9nfUDVTQmQVL2i1yvay+KuKolmvoB4EdtZ9rwSzq0kUrcP7rk27SJVJw/n60xR79+6vcWkYGFXQagzVYRdsqlvuZZH6Bjrq0iyGvXbQCJvqlTUbN/Vfwj2JtEYuZ7y5aAZN9Z+nHddB5mXhkPTAWcQzKv0UfCY7FvxwVlwmPYrBmSF2EMSi+SSACLhrIHpuQLFgCkwYoGrBMDHgymQmYNpamd4E7qKBnWbQJdLtVW0WsoKcuWgFTR8tR8y1S0L5hdwJM/9tHK+6QgktHL53swbHY3Fv5gr/yOAZr4KNQo/RDS/ubRZvA5f93wGBjsAbWuR9H/YIxGIQFS2DR+FYx6BisgUVjmy8ytN8RiotWwFg8ns37jqDv8RjoqGBPDrfn3gLTDVAwmCTzC+w7jQrOf9RCANiYtdkGFoM1sLC3FAzQRSssHTW0LNoEFvcHBYOMwZqs21FDtmBJp4r+Pw920eGoYbtoxRfqQ0u2ChS8OyrqRO9dalDNNgadD3NzlmsC1NtQfRyqz6Xq66FNTxN0LKrvS9U/W6h/PlT/jN/rPY1hf9F71L9rU/++dMg776Dqovp9C/V7T2vt+4fde8CwWw3DUdXv46s/iwELvZbzNLhMKDkTpf5cm10M1sBY9PdsIj5fao4tfATa04yq/oyw+nPe8MaFlrP6Q+9bYEf1LBbxRUsld2bU33tSf3dN/f3D8XdIPXdU9feAZe5ye9zd4KkK/ZaGJyo4LhqCMxWgJKczFaQsWOLlXAzZ2SYwZblzVPXzabBbyc8YctKG658TpX7Wl/55bWjm3tiI8Wfm3nrmuYnzvwrfzzz7cv6aaJp9OeH8UgezL00zaKWeAwyl38EMWv1zhPXPgm7N85Z9VH1yVCfzvPXPZH+cqy9frjyYq199G6GY+NsIhctvIyzK71tk+/WE37fI95nT71sQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQo5B8vlDCBniO5qwAAAABJRU5ErkJggg==' }} />
                                    </TouchableOpacity>
                                </View>
                                <Image
                                    style={[styles.avatar, { width: 60, height: 60, borderRadius: 0, resizeMode: 'cover' }]}
                                    source={{ uri: pic }}
                                />
                                <View>
                                </View>
                                <View style={{ paddingHorizontal: 5, top: 80 }}>
                                    <TextInput
                                        placeholder="name"
                                        value={name}
                                        onChangeText={(txt) => {
                                            this.setState({ name: txt });
                                        }}
                                        style={{ backgroundColor: "lightgray", }}
                                    />
                                    <TextInput
                                        placeholder="email"
                                        value={email}
                                        style={{ backgroundColor: "lightgray", top: 15, }}
                                        onChangeText={(txt) => {
                                            this.setState({ email: txt });
                                        }}
                                    />
                                    <TextInput
                                        editable={false}
                                        placeholder="user Id"
                                        value={id}
                                        style={{ backgroundColor: "lightgray", marginTop: 40 }}
                                        onChangeText={(txt) => {
                                            this.setState({ id: txt });
                                        }}
                                    />
                                    <View style={{ margin: 10 }}>
                                        <TouchableOpacity
                                            onPress={() => { this.userUpdate(name, email) }}
                                            style={{ height: 50, width: 80, backgroundColor: 'blue', alignSelf: 'center', justifyContent: 'center' }}
                                        >
                                            <Text style={{ alignSelf: 'center', justifyContent: 'center', color: '#FFF', fontSize: 15 }}>Update</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    AppReducer: state.AppReducer.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
    setUserInfo: (params) => dispatch(userInfo(params)),
    setIsLogin: (params) => dispatch(testAction(params)),
    setLogout: () => dispatch(logout())
});


export default connect(mapStateToProps, mapDispatchToProps)(Welcome);

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#00BFFF",
        height: 120,
    },
    avatar: {
        width: 85,
        height: 85,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        left: 15,
        alignSelf: 'flex-start',
        position: 'absolute',
        marginTop: 20
    },
    name: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: '600',
    },
    body: {
        marginTop: 10,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
    },
    name: {
        fontSize: 28,
        color: "#696969",
        fontWeight: "600"
    },
    info: {
        fontSize: 16,
        color: "#00BFFF",
        marginTop: 10
    },
    description: {
        fontSize: 16,
        color: "#696969",
        marginTop: 10,
        textAlign: 'center'
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040',
    },
    EditUserWraper: {
        backgroundColor: '#FFFFFF',
        height: 400,
        width: 300,
        borderRadius: 10,
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'space-around',
    },
});
