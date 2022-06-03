import { Actions, States } from "./adminReducerTypes";


export default function adminReducer(state: States, action: Actions): States {
    switch (action.type) {
        case "HOME":
            return {...state, mode: "HOME", item: null, msg: "" }
        case 'ADD_GAME':
            return {...state, mode: "ADD_GAME", item: null}
        case "EDIT_GAME":
            return {...state, mode: "EDIT_GAME", item: action.payload}
        case "REMOVE_GAME":
            return {...state, mode: "REMOVE_GAME", item: action.payload}
        case 'ADD_DEV':
            return {...state, mode: "ADD_DEV", item: null}
        case "EDIT_DEV":
            return {...state, mode: "EDIT_DEV", item: action.payload}
        case "REMOVE_DEV":
            return {...state, mode: "REMOVE_DEV", item: action.payload}
        case 'ADD_PUB':
            return {...state, mode: "ADD_PUB", item: null}
        case "EDIT_PUB":
            return {...state, mode: "EDIT_PUB", item: action.payload}
        case "REMOVE_PUB":
            return {...state, mode: "REMOVE_PUB", item: action.payload}
        case 'ADD_PLATFORM':
            return {...state, mode: "ADD_PLATFORM", item: null}
        case "EDIT_PLATFORM":
            return {...state, mode: "EDIT_PLATFORM", item: action.payload}
        case "REMOVE_PLATFORM":
            return {...state, mode: "REMOVE_PLATFORM", item: action.payload}
        case "SUCCESS":
            return {...state, mode: "HOME", item: null, rand: Math.random(), msg: action.payload}
        case "CLEAR_MSG":
            return {...state, msg: ""}
        default:
            throw new Error("Invalid action")
    }
}