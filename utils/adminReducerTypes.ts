import { Actor, Developer, Publisher, Game, Platform } from "@prisma/client";

export type TableToTypeMap = {
    'Game': Game
    'Developer': Developer
    'Publisher': Publisher
    'Platform': Platform
    'Actor': Actor
}

export type Tables = keyof TableToTypeMap
export type Models = TableToTypeMap[keyof TableToTypeMap]

type AddTypes = Uppercase<`ADD_${Tables}`>
type EditTypes = Uppercase<`EDIT_${Tables}`>
type RemoveTypes = Uppercase<`REMOVE_${Tables}`>
type AllTypes = AddTypes | EditTypes | RemoveTypes | 'HOME' | 'SUCCESS'


export type TypesWithPayload = EditTypes | RemoveTypes

export type AdminState = {
    mode: TypesWithPayload,
    item: Models
} | {
    mode: Exclude<AllTypes, TypesWithPayload>,
    item: null
}

export type ActionWithPayload = {
    type: TypesWithPayload,
    payload: Models
}
export type ActionWithoutPayload = {
    type: Exclude<AllTypes, TypesWithPayload>,
}

export type AdminAction = ActionWithPayload | ActionWithoutPayload

type ActionGenerator<T extends keyof TableToTypeMap> = {
    type: Uppercase<`ADD_${T}`>
} | {
    type: Uppercase<`EDIT_${T}`> | Uppercase<`REMOVE_${T}`>
    payload: TableToTypeMap[T]
}
export type Actions = { [k in keyof TableToTypeMap]: ActionGenerator<k> }[keyof TableToTypeMap]
    | {
        type: 'SUCCESS', payload: string
    } | {
        type: "CLEAR_MSG"
    } | {
        type: "HOME"
    }

type StateGenerator<T extends keyof TableToTypeMap> = {
    mode: Uppercase<`ADD_${T}`>
    item: null
    rand: number
    msg: string
} | {
    mode: Uppercase<`EDIT_${T}`> | Uppercase<`REMOVE_${T}`>
    item: TableToTypeMap[T]
    rand: number
    msg: string
}
export type States = {
    [k in keyof TableToTypeMap]: StateGenerator<k>
}[keyof TableToTypeMap]
    | {
        mode: "HOME"
        item: null
        rand: number
        msg: string
    }
