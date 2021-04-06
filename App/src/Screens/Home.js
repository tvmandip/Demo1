import React, { Component } from 'react'
import { Button, FlatList, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { testAction, StoreData } from './Redux/Actions/Actions';
import Loader from './Loader'

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: false
        }
    };

    componentDidMount() {
        this.ApiCall()
        // this.props.setTestAction(true)
        console.log("home screen", this.props.AppReducer.data)
        // this.props.setTestAction(true);
        this.props.AppReducer.data == "" ? this.ApiCall() : this.setState({ data: this.props.AppReducer.data })
    }

    ApiCall() {
        this.setState({ loading: true })
        fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.props.setData(responseJson)
                this.setState({
                    data: responseJson,
                    loading: false
                })
            })
            .catch((error) => {
                console.error(error);
                this.setState({ loading: false })
            });

    }
    render() {
        return (
            <View>
                <Text style={{ fontSize: 18, alignSelf: 'center' }}>Testing</Text>
                <FlatList
                    contentContainerStyle={{ backgroundColor: 'lime' }}
                    style={{ paddingVertical: 5 }}
                    data={this.state.data}
                    keyExtractor={(item) => {
                        return item.id;
                    }}
                    renderItem={(item, index) => {
                        // console.log("data", item)
                        return (
                            <View style={{ padding: 5, paddingVertical: 15 }}>
                                <Text>{item.item.title}</Text>
                                <Text>{item.item.completed}</Text>
                            </View>
                        )
                    }}
                />
                <Loader loading={this.state.loading} />
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    AppReducer: state.AppReducer,
});

const mapDispatchToProps = (dispatch) => ({
    setTestAction: (params) => dispatch(testAction(params)),
    setData: (params) => dispatch(StoreData(params))
});


export default connect(mapStateToProps, mapDispatchToProps)(Home);

// const mapStateToProps = (state) => {
//     console.log("state", state);
//     const data = state.data
// };

// export default connect(mapStateToProps, { testAction, StoreData })(Home);