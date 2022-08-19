import { GameUpdateState } from "./initialGameState"

type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export type GameReducerAction = {
    type: 'UPDATE_STRING'
    payload: {
        name: keyof GameUpdateState,
        value: string
    }
} | {
    type: 'ADD_TO_ARRAY' | 'REMOVE_FROM_ARRAY'
    payload: {
        name: KeysMatching<GameUpdateState, string[]>,
        value: string
    }
}

export default function gameReducer(state: GameUpdateState, action: GameReducerAction): GameUpdateState {
    switch (action.type) {
        case 'UPDATE_STRING':
            return { ...state, [action.payload.name]: action.payload.value }
        case 'ADD_TO_ARRAY':
            return { ...state, [action.payload.name]: [...state[action.payload.name], action.payload.value] }
        case 'REMOVE_FROM_ARRAY':
            console.log(state)
            const arr = state[action.payload.name]
            const newArr = arr.filter(item => item != action.payload.value)
            return { ...state, [action.payload.name]: newArr }
        default:
            return state
    }
}