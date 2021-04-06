import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    Platform
} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { GoogleSignin } from '@react-native-community/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { connect } from 'react-redux';
import { isLogin, testAction } from '../Redux/Actions/Actions';
import Button from '../Component/Button'
import InputBox from '../Component/InputBox'
import Loader from './Loader';
import Colors from '../Helper/Colors'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            confrimPassword: '',
            phone: '',
            signUp: false,
            loading: false
        }
    }

    componentDidMount() {
        console.log("islogin", this.props.AppReducer)
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly', 'profile', 'email'],
            webClientId: '627802040562-8p1301o8qoaa61aae28cohs87ogqas38.apps.googleusercontent.com',
            offlineAccess: false,
            forceConsentPrompt: true
        });
    }

    // google login for user
    Google_Login = async () => {
        try {
            const { idToken } = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            // console.log('gooogle ' + JSON.stringify(googleCredential))
            // Sign-in the user with the credential
            const G_user = await auth().signInWithCredential(googleCredential)
            console.log('gooogle ' + JSON.stringify(G_user.additionalUserInfo.profile.email))
            console.log("resssssssss", G_user.additionalUserInfo.profile)
            const userInfo = G_user.additionalUserInfo.profile;
            database()
                .ref('/users')
                .orderByChild("email")
                .equalTo(G_user.additionalUserInfo.profile.email)
                .once("value")
                .then(snapshot => {
                    if (snapshot.val()) {
                        console.log("already user here")
                        console.log(snapshot.val())
                        this.props.setTest(true);
                        this.props.navigation.navigate('Welcome', { data: G_user.additionalUserInfo.profile.email })
                    } else {
                        console.log("not user here")
                        console.log(snapshot.val())
                        database()
                            .ref('/users')
                            .push({
                                name: userInfo.name,
                                email: userInfo.email,
                                pic: userInfo.picture === null ? 'https://bootdey.com/img/Content/avatar/avatar6.png' : userInfo.picture,
                                registre_type: 'google',
                                userid: userInfo.sub
                            }).then((userInfo) => console.log('Data set.', JSON.stringify(userInfo)));
                        navigation.navigate('Welcome', { data: userInfo.email })
                        console.log(Name + "  " + userInfo.user.email + "  " + userInfo.user.photoURL + "   " + userInfo.user.uid)
                        alert('User account created & signed in!')
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }


    // facebook login
    FBFirebase_auth = () => {

        if (Platform.OS === "android") {
            LoginManager.setLoginBehavior("web_only");
            //alert("set");
        }
        LoginManager.logInWithPermissions(["public_profile", "email"])
            .then((result) => {
                if (result.isCancelled) {
                    return Promise.reject(new Error('The user cancle request'))
                }
                return AccessToken.getCurrentAccessToken();
            })
            .then(data => {
                const credential = auth.FacebookAuthProvider.credential(data.accessToken);
                // console.log('credential', credential)
                return auth().signInWithCredential(credential);
            })
            .then((currentUser) => {

                console.log('currentUser Name::', currentUser.additionalUserInfo.profile.name)
                console.log('currentUser email::', currentUser.additionalUserInfo.profile.email)
                console.log('currentUser pic ::', currentUser.additionalUserInfo.profile.picture.data.url)
                console.log('currentUser id::', currentUser.additionalUserInfo.profile.id)
                // console.log('currentUserOnlyProfile', currentUser.additionalUserInfo.profile.picture.data.url)
                // console.log('currentUser', currentUser.user)
                // console.log(`Facebook login with user:${JSON.stringify(currentUser)}`)

                database()
                    .ref('/users')
                    .orderByChild("email")
                    .equalTo(currentUser.additionalUserInfo.profile.email)
                    .once("value")
                    .then(snapshot => {
                        if (snapshot.val()) {
                            console.log("already user here")
                            console.log(snapshot.val())
                            this.props.setTest(true);
                            this.props.navigation.navigate('Welcome', { data: currentUser.additionalUserInfo.profile.email })
                        } else {
                            console.log("not user here")
                            console.log(snapshot.val())
                            database()
                                .ref('/users')
                                .push({
                                    name: currentUser.additionalUserInfo.profile.name,
                                    email: currentUser.additionalUserInfo.profile.email,
                                    pic: currentUser.additionalUserInfo.profile.picture.data.url === null ? 'https://bootdey.com/img/Content/avatar/avatar6.png' : currentUser.additionalUserInfo.profile.picture.data.url,
                                    registre_type: 'facebook',
                                    userid: currentUser.additionalUserInfo.profile.id
                                }).then((userInfo) => console.log('Data set.', JSON.stringify(userInfo)));
                            this.props.navigation.navigate('Welcome', { data: currentUser.additionalUserInfo.profile.email })
                            console.log(Name + "  " + userInfo.user.email + "  " + userInfo.user.photoURL + "   " + userInfo.user.uid)
                            alert('User account created & signed in!')
                        }
                    })

            })

        // console.log(`Facebook login fail with error:${error}`);

    }

    //create user useing email
    onsubmit = (email, password) => {
        console.log("email", email, "password", password)
        if (email === "" && password.length === 0) {
            alert("fil the deatils")
        } else {
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then((res) => {
                    console.log(JSON.stringify(res))
                    database()
                        .ref('/users')
                        .push({
                            name: this.state.username,
                            email: res.user.email,
                            pic: res.user.photoURL === null ? 'https://bootdey.com/img/Content/avatar/avatar6.png' : res.user.photoURL,
                            registre_type: 'email',
                            userid: res.user.uid
                        }).then((res) => console.log('Data set.', JSON.stringify(res)));
                    console.log(res.user.name + "  " + res.user.email + "  " + res.user.photoURL + "   " + res.user.uid)
                    alert('User account created & signed in!');
                    // navigation.navigate('Login');
                    // this.clear()
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        console.log('That email address is already in use!');
                        alert('That email address is already in use!')
                    }

                    if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!');
                        alert('That email address is invalid!')
                    }
                    else {
                        alert(error)
                    }

                    console.error(error);
                });
        }
    }

    //email password login
    User_Login = () => {
        this.setState({ loading: true })
        console.log(this.state.email, this.state.password)
        if (this.state.email === "" || this.state.password === "") {
            alert("fill details")
            this.setState({ loading: false })
        } else {
            try {
                auth()
                    .signInWithEmailAndPassword(this.state.email, this.state.password)
                    .then(res => {
                        this.setState({ loading: false })
                        console.log("ressssss", res)
                        // this.props.setUserInfo(res)
                        this.props.setTest(true);
                        this.props.navigation.navigate('Welcome', { data: this.state.email })

                    })
                    .catch(error => {
                        this.setState({ loading: false })
                        if (error.code === 'auth/user-not-found') {
                            alert('That User not Register !')
                        } else {
                            alert(error)
                        }

                        console.error(error);
                    });
            } catch (error) {
                alert(error.error)
                console.log(error.toString(error));
            }
        }
    }

    render() {
        const { email, password } = this.state;
        return (
            <View style={styles.container}>
                <Image style={styles.bgImage} source={{ uri: "https://image.freepik.com/free-vector/3d-paper-style-wallpaper_52683-34469.jpg" }} />
                {this.state.signUp ? <View>
                    {/* UserName Input View */}

                    <View style={{ marginTop: 30, }}>
                        <InputBox
                            InputBox_container={{ marginHorizontal: 22 }}
                            placeholderTextColor="gray"
                            placeholder="User Name"
                            onChangeText={(username) => this.setState({ username })}
                            IMG={"https://img.icons8.com/nolan/40/000000/user.png"}
                        />
                    </View>

                    {/* Phone number Input View */}

                    <View >
                        <InputBox
                            InputBox_container={{ marginHorizontal: 22 }}
                            placeholderTextColor="gray"
                            placeholder="Phone"
                            keyboardType="number-pad"
                            underlineColorAndroid='transparent'
                            onChangeText={(phone) => this.setState({ phone })}
                            IMG={"https://img.icons8.com/nolan/40/000000/phone.png"}
                        />
                    </View>

                </View> : null}

                {/* Email Input View */}

                <View style={{ marginTop: !this.state.signUp ? 30 : 0, }}>
                    <InputBox
                        InputBox_container={{ marginHorizontal: 22, }}
                        placeholderTextColor="gray"
                        keyboardType="email-address"
                        placeholder="Email ID"
                        value={email}
                        onChangeText={(email) => this.setState({ email })}
                        IMG={"https://img.icons8.com/nolan/40/000000/email.png"}
                    />
                </View>

                {/* Password Input View */}

                <View style={{ marginTop: 10, }}>
                    <InputBox
                        InputBox_container={{ marginHorizontal: 22, }}
                        placeholderTextColor="gray"
                        secureTextEntry={true}
                        placeholder="Password"
                        value={password}
                        onChangeText={(password) => this.setState({ password })}
                        IMG={"https://img.icons8.com/nolan/40/000000/password.png"}
                    />
                </View>


                <Button
                    onPress={() => this.state.signUp ? this.onsubmit(email, password) : this.User_Login()}
                    BtnName={this.state.signUp ? "SignUp" : "Login"} />

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.setState({ signUp: !this.state.signUp })}>
                    <Text style={styles.btnText}>{!this.state.signUp ? "Register" : "Login"}</Text>
                </TouchableOpacity>

                <View style={{ top: 30 }}>
                    <TouchableOpacity
                        style={[styles.buttonContainer, styles.loginButton, { backgroundColor: 'red', borderRadius: 5 }]}
                        onPress={() => this.Google_Login()}>
                        <Image style={styles.inputIcon} source={{ uri: 'data:image/png;base64,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' }} />
                        <Text style={styles.loginText}>{"Google"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonContainer, styles.loginButton, { backgroundColor: 'blue', borderRadius: 5 }]}
                        onPress={() => this.FBFirebase_auth()}>
                        <Image style={styles.inputIcon} source={{ uri: 'data:image/png;base64,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' }} />
                        <Text style={styles.loginText}>{"FaceBook"}</Text>
                    </TouchableOpacity>
                </View>

                <Loader loading={this.state.loading} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    AppReducer: state.AppReducer.test,
    isLogin: state.AppReducer.login
});

const mapDispatchToProps = (dispatch) => ({
    setLogin: (params) => dispatch(isLogin(params)),
    setTest: (params) => dispatch(testAction(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const resizeMode = 'center';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: Colors.white,
        borderRadius: 30,
        borderBottomWidth: 1,
        width: 300,
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',

        shadowColor: "#808080",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: Colors.white,
        flex: 1,
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginRight: 15,
        justifyContent: 'center'
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 300,
        borderRadius: 30,
        backgroundColor: 'transparent'
    },
    btnForgotPassword: {
        height: 15,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: 10,
        width: 300,
        backgroundColor: 'transparent'
    },
    loginButton: {
        backgroundColor: "#00b5ec",

        shadowColor: "#808080",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,

        elevation: 19,
    },
    loginText: {
        color: 'white',
    },
    bgImage: {
        flex: 1,
        resizeMode: 'cover',
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    btnText: {
        color: "white",
        fontWeight: 'bold'
    }
});