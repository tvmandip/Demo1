import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity, FlatList ,Modal} from 'react-native'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { connect } from 'react-redux';
import { userInfo } from './Redux/Actions/Actions'
import { GoogleSignin } from '@react-native-community/google-signin';


class Welcome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: false,
            userDetails: [],
            userLists: [],
        }
    };
    componentDidMount() {
        console.log("propsss", this.props.AppReducer)
        this.props.AppReducer === "" ? this.getUserInfo() : this.setState({ userInfo: this.props.AppReducer })
        this.getUserInfo()
    }

    getUserInfo() {
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
                        if (this.props.route.params.data == child.val().email) {
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
                    this.props.setUserInfo(currentUser)

                    // setUserList(users);
                    // console.log("User ", currentUser);
                    // console.log("UserList ", users);
                });
        } catch (error) {
            alert(error);

        }
    }

    logout = async () => {
        this.props.setUserInfo([])
        auth()
            .signOut()
            .then(() => console.log('User signed out!'));
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();

        } catch (error) {
            console.error(error);
        }
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
        const { userDetails, userLists } = this.state;
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
                                onPress={() => { this.logout() }}
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
                                        onPress={() => { navigation.navigate('Chat', { name: User.name, rname: item.name, rid: item.id, sid: User.id }) }}
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
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    AppReducer: state.AppReducer.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
    setUserInfo: (params) => dispatch(userInfo(params))
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

});
