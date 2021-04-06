import React, { Component } from 'react'
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import database from '@react-native-firebase/database';
import { connect } from 'react-redux'
import { userInfo } from '../Redux/Actions/Actions';
import InputBox from '../Component/InputBox'
import Button from '../Component/Button'

class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userDetails: this.props.route.params.data,
            name: '',
            email: "",
            id: '',
            pic: '',
            fid: ''
        }
    }

    componentDidMount() {
        console.log("data of user", this.state.userDetails)
        this.setState({ name: this.state.userDetails.name, fid: this.state.userDetails.firebaseId, id: this.state.userDetails.id, email: this.state.userDetails.email, pic: this.state.userDetails.profileImg })
    }

    //update user details
    userUpdate = (name, email) => {
        try {
            const res = database().ref(`/users`).child(this.state.fid).update({ name: name })
            this.getUserInfo();
            alert("User details updated")
            console.log("resss update", res)
        } catch (error) {
            console.log("err", error)
        }
    }

    getUserInfo() {
        this.props.setUserInfo([])
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
                        if (this.state.email == child.val().email) {
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
                    console.log("User After", currentUser);
                    // console.log("UserList ", users);
                });
        } catch (error) {
            alert(error);
        }
    }

    render() {
        const { id, email, name } = this.state
        return (
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: "#dfdfff", height: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => { this.props.navigation.navigate("Welcome") }}
                        style={{ position: 'absolute', left: 30, top: 30 }}
                    >
                        <Image style={{ height: 30, width: 30 }} source={{ uri: 'https://img.icons8.com/nolan/40/000000/back.png' }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18 }}>{"Edit User"}</Text>
                </View>
                <View style={{ paddingHorizontal: 5, top: 50, alignSelf: 'center' }}>
                    <View style={{ marginTop: 30, }}>
                        <InputBox
                            InputBox_container={{ marginHorizontal: 22 }}
                            placeholderTextColor="gray"
                            placeholder="Name"
                            value={name}
                            onChangeText={(name) => this.setState({ name })}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <InputBox
                            InputBox_container={{ marginHorizontal: 22 }}
                            placeholderTextColor="gray"
                            placeholder="Email"
                            value={email}
                            onChangeText={(email) => this.setState({ email })}
                        />
                    </View>
                    <InputBox
                        editable={false}
                        placeholder="user Id"
                        value={id}
                        InputBox_container={{ marginHorizontal: 22 }}
                        placeholderTextColor="gray"
                        onChangeText={(txt) => {
                            this.setState({ id: txt });
                        }}
                    />
                    <View style={{ marginTop: 30 }}>
                        <Button
                            onPress={() => { this.userUpdate(name, email) }}
                            buttoncontainer={{ height: 50, width: 80, alignSelf: 'center', justifyContent: 'center' }}
                            BtnName={"Update"}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    AppReducer: state.AppReducer.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
    setUserInfo: (params) => dispatch(userInfo(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);