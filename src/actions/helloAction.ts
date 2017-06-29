import * as types from "./actionTypes";

export function sayHello(name: string) {
    return (dispatch:Function) => {
        dispatch({
            type: types.SAY_HELLO,
            name: name
        });
    };
}