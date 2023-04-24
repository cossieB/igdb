import React, { useEffect, useReducer } from "react"
import adminReducer from "../../utils/adminReducer"
import { Actions, States } from "../../utils/adminReducerTypes";
import styles from '../../styles/dashboard.module.scss'
import Panel from "../../components/admin/DashboardPanel";
import useFetch from "../../utils/useFetch";
import { backSvg } from "../../utils/svgs";
import Popup from "../../components/Popup";
import EditDev from "../../components/admin/EditDev";
import { AnimatePresence } from "framer-motion";
import { API_RESPONSE } from "./../api/admin";
import DashboardNav from "../../components/admin/DashboardNav";

const init: States = {
    mode: "HOME",
    item: null,
    rand: 0,
    msg: ""
}

export default function Dashboard() {
    // const [state, dispatch] = useReducer(adminReducer, init);
    // const result = useFetch<API_RESPONSE>('/api/admin')
    // if (result[0]) throw new Error("Could receive data")
    // const data = result[1]!
    // data?.gamesOnPlatforms.sort((a, b) => {
    //     if (a.gameId > b.gameId) return 1
    //     else return -1
    // })
    // data?.genresOfGames.sort((a, b) => {
    //     if (a.gameId > b.gameId) return 1
    //     else return -1
    // })
    return (
        <div className={styles.container} >
            <div className={styles.h1}>Admin Dashboard</div>
            <DashboardNav />
            {/* {state.mode != "HOME" && <span onClick={() => dispatch({ type: "HOME" })} className={styles.backBtn} >{backSvg}</span>}
            {state.mode == "HOME" &&
                <div className={styles.main} >
                    <Panel displayField="title" items={data?.games} h2="Games" dispatch={dispatch} />
                    <Panel displayField="name" items={data?.devs} h2="Developers" dispatch={dispatch} />
                    <Panel displayField="name" items={data?.pubs} h2="Publishers" dispatch={dispatch} />
                    <Panel displayField="name" items={data?.platforms} h2="Platforms" dispatch={dispatch} />
                </div>
            }
            <AnimatePresence>
                {state.msg &&
                    <Popup>
                        <Message message={state.msg} dispatch={dispatch} />
                    </Popup>
                }
            </AnimatePresence>
            {(state.mode == "ADD_GAME" || state.mode == "EDIT_GAME" || state.mode == "REMOVE_GAME") &&
                <EditGame
                    devs={data.devs}
                    pubs={data.pubs}
                    game={state.item}
                    platforms={data.platforms}
                    gamesOnPlatforms={data.gamesOnPlatforms}
                    dispatch={dispatch}
                    isDelete={state.mode == "REMOVE_GAME"}
                    games={data.games}
                    genresOfGames={data.genresOfGames}
                />
            }
            {(state.mode == "ADD_DEVELOPER" || state.mode == "EDIT_DEVELOPER" || state.mode == "REMOVE_DEVELOPER") &&
                <EditDev dev={state.item} dispatch={dispatch} isDelete={state.mode == "REMOVE_DEVELOPER"} developers={data.devs} />
            }

            {(state.mode == "ADD_PUBLISHER" || state.mode == "EDIT_PUBLISHER" || state.mode == "REMOVE_PUBLISHER") &&
                <EditPub pub={state.item} dispatch={dispatch} isDelete={state.mode == "REMOVE_PUBLISHER"} publishers={data.pubs} />
            }
            {(state.mode == "ADD_PLATFORM" || state.mode == "EDIT_PLATFORM" || state.mode == "REMOVE_PLATFORM") &&
                <EditPlatform platform={state.item} dispatch={dispatch} isDelete={state.mode == "REMOVE_PLATFORM"} platforms={data.platforms} />
            } */}

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




