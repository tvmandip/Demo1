import * as types from './ActionsType';

export const testAction = (payload) => {
    console.log("Appreducer", payload)
    return ({
        type: types.Test,
        payload,
    })
};

export const StoreData = (payload) => {
    return ({
        type: types.ApiData,
        payload,
    })
};

export const userInfo = (payload) => {
    console.log("payoad", payload)
    return ({
        type: types.UserDetails,
        payload,
    })
}