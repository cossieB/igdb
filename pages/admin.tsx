import React, { useEffect, useReducer } from "react"
import { IGame } from "../models/game"
import adminReducer from "../utils/adminReducer"
import { Actions, States } from "../utils/adminReducerTypes";
import styles from '../styles/dashboard.module.scss'
import { IPub } from "../models/publisher";
import { IDev } from "../models/developers";
import Panel from "../components/DashboardPanel";
import { IPlatform } from "../models/platform";
import useFetch from "../utils/useFetch";
import { backSvg } from "../utils/svgs";
import EditGame from "../components/EditGame";
import Popup from "../components/Popup";
import EditDev from "../components/EditDev";
import { AnimatePresence } from "framer-motion";
import EditPub from "../components/EditPub";
import EditPlatform from "../components/EditPlatform";

const init: States = {
    mode: "HOME",
    item: null,
    rand: 0,
    msg: ""
}

export default function Dashboard() {
    const [state, dispatch] = useReducer(adminReducer, init);
    const games = useFetch<IGame>(`/api/admin/game`, state.rand);
    const devs = useFetch<IDev>(`/api/admin/dev`, state.rand);
    const pubs = useFetch<IPub>(`/api/admin/pub`, state.rand);
    const platforms = useFetch<IPlatform>(`/api/admin/platform`, state.rand);

    return (
        <div className={styles.container} >
            <div className={styles.h1}>Admin Dashboard</div>
            {state.mode != "HOME" && <span onClick={() => dispatch({ type: "HOME" })} className={styles.backBtn} >{backSvg}</span>}
            {state.mode == "HOME" &&
                <div className={styles.main} >
                    <Panel displayField="title" items={games} h2="Games" dispatch={dispatch} />
                    <Panel displayField="name" items={devs} h2="Developers" dispatch={dispatch} />
                    <Panel displayField="name" items={pubs} h2="Publishers" dispatch={dispatch} />
                    <Panel displayField="name" items={platforms} h2="Platforms" dispatch={dispatch} />
                </div>
            }
            <AnimatePresence>
                {state.msg &&
                    <Popup>
                        <Message message={state.msg} dispatch={dispatch} />
                    </Popup>
                }
            </AnimatePresence>
            {(state.mode == "ADD_GAME" || state.mode == "EDIT_GAME" || state.mode == "REMOVE_GAME" ) &&
                <EditGame devs={devs} pubs={pubs} game={state.item} platforms={platforms} dispatch={dispatch} isDelete={state.mode == "REMOVE_GAME"} />
            }
            {(state.mode == "ADD_DEV" || state.mode == "EDIT_DEV" || state.mode == "REMOVE_DEV" ) &&
                <EditDev dev={state.item} dispatch={dispatch} isDelete={state.mode == "REMOVE_DEV"} />
            }

            {(state.mode == "ADD_PUB" || state.mode == "EDIT_PUB" || state.mode == "REMOVE_PUB" ) && 
                <EditPub pub={state.item} dispatch={dispatch} isDelete={state.mode == "REMOVE_PUB"} />
            }
            {(state.mode == "ADD_PLATFORM" || state.mode == "EDIT_PLATFORM" || state.mode == "REMOVE_PLATFORM" ) && 
                <EditPlatform platform={state.item} dispatch={dispatch} isDelete={state.mode == "REMOVE_PLATFORM"} />
            }

        </div>
    )
}

interface P {
    dispatch: React.Dispatch<Actions>,
    message: string
}

function Message({ dispatch, message }: P) {
    useEffect(() => {
        const t = setTimeout(() => {
            dispatch({ type: "CLEAR_MSG" })
        }, 3500)
        return () => clearTimeout(t)
    })
    return (
        <>
            {message}
        </>
    )
}




