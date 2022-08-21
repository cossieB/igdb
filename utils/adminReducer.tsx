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
        case 'ADD_DEVELOPER':
            return {...state, mode: "ADD_DEVELOPER", item: null}
        case "EDIT_DEVELOPER":
            return {...state, mode: "EDIT_DEVELOPER", item: action.payload}
        case "REMOVE_DEVELOPER":
            return {...state, mode: "REMOVE_DEVELOPER", item: action.payload}
        case 'ADD_PUBLISHER':
            return {...state, mode: "ADD_PUBLISHER", item: null}
        case "EDIT_PUBLISHER":
            return {...state, mode: "EDIT_PUBLISHER", item: action.payload}
        case "REMOVE_PUBLISHER":
            return {...state, mode: "REMOVE_PUBLISHER", item: action.payload}
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