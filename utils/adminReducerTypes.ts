import { ActorWithId } from "../models/actor";
import { DevDoc, DevWithId } from "../models/developers";
import { GameDoc, GameWithId } from "../models/game";
import { PlatformDoc, PlatformWithId } from "../models/platform";
import { PubDoc, PubWithId } from "../models/publisher";

 
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
    payload: GameDoc
} | {
    type: typeof types["EDIT_DEV"],
    payload: DevDoc    
} | {
    type: typeof types["EDIT_PUB"],
    payload: PubDoc    
} | {
    type: typeof types["EDIT_PLATFORM"],
    payload: PlatformDoc
} | {
    type: typeof types["REMOVE_GAME"],
    payload: GameDoc
} | {
    type: typeof types["REMOVE_DEV"],
    payload: DevDoc    
} | {
    type: typeof types["REMOVE_PUB"],
    payload: PubDoc        
} | {
    type: typeof types["REMOVE_PLATFORM"],
    payload: PlatformDoc
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
    item: GameDoc,
    rand: number,
    msg: string
} | {
    mode: typeof types["REMOVE_GAME"],
    item: GameDoc,
    rand: number,
    msg: string,

} | {
    mode: typeof types["EDIT_DEV"],
    item: DevDoc,
    rand: number,
    msg: string   
} | {
    mode: typeof types["REMOVE_DEV"],
    item: DevDoc ,
    rand: number,
    msg: string   
} | {
    mode: typeof types["EDIT_PUB"],
    item: PubDoc,
    rand: number,
    msg: string    
} | {
    mode: typeof types["REMOVE_PUB"],
    item: PubDoc,
    rand: number,
    msg: string      
} | {
    mode: typeof types["EDIT_PLATFORM"],
    item: PlatformDoc ,
    rand: number,
    msg: string   
} | {
    mode: typeof types["REMOVE_PLATFORM"],
    item: PlatformDoc ,
    rand: number,
    msg: string   
}