import { ActorWithId } from "../models/actor";
import { IDev, DevWithId } from "../models/developers";
import { IGame, GameWithId } from "../models/game";
import { IPlatform, PlatformWithId } from "../models/platform";
import { IPub, PubWithId } from "../models/publisher";

 
const types = {
    ADD_GAME: "ADD_GAME",
    EDIT_GAME: "EDIT_GAME",
    REMOVE_GAME: "REMOVE_GAME",
    ADD_DEV: "ADD_DEV",
    EDIT_DEV: "EDIT_DEV",
    REMOVE_DEV: "REMOVE_DEV",
    ADD_PUB: "ADD_PUB",
    EDIT_PUB: "EDIT_PUB",
    REMOVE_PUB: "REMOVE_PUB",
    ADD_PLATFORM: "ADD_PLATFORM",
    EDIT_PLATFORM: "EDIT_PLATFORM",
    REMOVE_PLATFORM: "REMOVE_PLATFORM",
    HOME: "HOME",
    SUCCESS: "SUCCESS",
    CLEAR_MSG: "CLEAR_MSG"
} as const;

export type AdminActionType = keyof typeof types

export type Models = GameWithId | DevWithId | PubWithId | PlatformWithId | ActorWithId 

type TypesToExclude = "HOME" | "ADD_GAME" | "ADD_DEV" | "ADD_PUB"

export type TypesWithPayload = Exclude<AdminActionType, TypesToExclude>

export type AdminState = {
    mode: Exclude<AdminActionType, TypesToExclude>,
    item: Models
} | {
    mode: TypesToExclude,
    item: null
}

export type ActionWithPayload = {
    type: Exclude<AdminActionType, TypesToExclude>,
    payload: Models        
}
export type ActionWithoutPayload = {
    type: TypesToExclude,      
}

export type AdminAction = ActionWithPayload | ActionWithoutPayload
 
export type Actions = {
    type: typeof types["ADD_GAME"],
} | {
    type: typeof types["ADD_DEV"],    
} | {
    type: typeof types["ADD_PUB"],    
} | {
    type: typeof types["ADD_PLATFORM"]
} | {
    type: typeof types["EDIT_GAME"],
    payload: IGame
} | {
    type: typeof types["EDIT_DEV"],
    payload: IDev    
} | {
    type: typeof types["EDIT_PUB"],
    payload: IPub    
} | {
    type: typeof types["EDIT_PLATFORM"],
    payload: IPlatform
} | {
    type: typeof types["REMOVE_GAME"],
    payload: IGame
} | {
    type: typeof types["REMOVE_DEV"],
    payload: IDev    
} | {
    type: typeof types["REMOVE_PUB"],
    payload: IPub        
} | {
    type: typeof types["REMOVE_PLATFORM"],
    payload: IPlatform
} | {
    type: typeof types["HOME"],
} | {
    type: typeof types["SUCCESS"],
    payload: string
} | {
    type: typeof types["CLEAR_MSG"]
}

export type States = {
    mode: typeof types["ADD_GAME"] | typeof types["ADD_DEV"] | typeof types["ADD_PUB"] | typeof types["ADD_PLATFORM"] | typeof types["HOME"]
    item: null,
    rand: number,
    msg: string
} | {
    mode: typeof types["EDIT_GAME"],
    item: IGame,
    rand: number,
    msg: string
} | {
    mode: typeof types["REMOVE_GAME"],
    item: IGame,
    rand: number,
    msg: string,

} | {
    mode: typeof types["EDIT_DEV"],
    item: IDev,
    rand: number,
    msg: string   
} | {
    mode: typeof types["REMOVE_DEV"],
    item: IDev ,
    rand: number,
    msg: string   
} | {
    mode: typeof types["EDIT_PUB"],
    item: IPub,
    rand: number,
    msg: string    
} | {
    mode: typeof types["REMOVE_PUB"],
    item: IPub,
    rand: number,
    msg: string      
} | {
    mode: typeof types["EDIT_PLATFORM"],
    item: IPlatform ,
    rand: number,
    msg: string   
} | {
    mode: typeof types["REMOVE_PLATFORM"],
    item: IPlatform ,
    rand: number,
    msg: string   
}