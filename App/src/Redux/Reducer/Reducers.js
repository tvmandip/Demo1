import * as types from '../Actions/ActionsType';

const initialState = {
    test: false,
    data: [],
    userInfo: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.Test:
            console.log("Test:: ", action.payload)
            return {
                ...state,
                test: action.payload,
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
        default:
            return state;
    }
};

