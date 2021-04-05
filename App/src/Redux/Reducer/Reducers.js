import * as types from '../Actions/ActionsType';

const initialState = {
    test: false,
    data: [],
    userInfo: [],
    login: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.Test:
            // console.log("Test:: ", action.payload)
            return {
                ...state,
                test: action.payload,
            }

        case types.Test:
            return {
                ...state,
                login: action.payload,
            }
        case types.ApiData:
            return {
                ...state,
                data: action.payload
            }

        case types.UserDetails:
            return {
                ...state,
                userInfo: action.payload
            }
        case types.Logout:
            return {
                test: false,
                data: [],
                userInfo: [],
            }
        default:
            return state;
    }
};

