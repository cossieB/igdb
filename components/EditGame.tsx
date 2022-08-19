import { AnimatePresence } from "framer-motion";
import { Dispatch, useReducer, useState } from "react";
import { IDev } from "../models/developers";
import { IGame } from "../models/game";
import { IPlatform } from "../models/platform";
import { IPub } from "../models/publisher";
import Tags from "./Tags";
import styles from '../styles/dashboard.module.scss'
import Popup from "./Popup";
import { formatDateForInputElement } from "../utils/formatDate";
import { Actions } from "../utils/adminReducerTypes";
import { marked } from "marked";
import gameReducer, { GameReducerAction } from "../utils/gameReducer";
import { GameUpdateState, initialGameUpdateState } from "../utils/initialGameState";
import titleCase from "../utils/titleCase";

interface Props {
    game: IGame | null,
    pubs: IPub[],
    devs: IDev[],
    platforms: IPlatform[],
    isDelete: boolean,
    dispatch: React.Dispatch<Actions>
}
function changeType(game: IGame | null): GameUpdateState | null {
    if (!game) return null;
    return {
        ...game,
        id: game._id!.toString(),
        releaseDate: game.releaseDate,
        platformIds: game.platforms.map(item => item._id.toString()),
        developerId: game.developer._id.toString(),
        publisherId: game.publisher._id.toString(),
    }
}

export default function EditGame(props: Props) {
    const { game, pubs, devs, platforms, isDelete, dispatch } = props;
    const [genreInput, setGenreInput] = useState("")
    const [errors, setErrors] = useState<string[]>([])
    const [challengeAnswer, setChallengeAnswer] = useState("");

    const [gameState, gameDispatch] = useReducer(gameReducer, changeType(game) || initialGameUpdateState); console.log(gameState)

    function handleKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == "Enter") {
            if (genreInput.length == 0 || gameState.genres.includes(genreInput)) return;
            gameDispatch({ type: 'ADD_TO_ARRAY', payload: { name: 'genres', value: genreInput.toLowerCase() } })
            setGenreInput("")
        }
    }
    async function send() {
        const response = await fetch('/api/admin/game', {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                ...gameState,
                title: gameState.title.trim(),
                summary: marked(gameState.summary),
                id: game?._id?.toString(),
            })
        })
        const data = await response.json();
        if (data.msg) {
            return dispatch({ type: "SUCCESS", payload: data.msg })
        }
        if (data.error) {
            setErrors([data.error])
            setTimeout(() => {
                setErrors([])
            }, 3500)
        }
    }
    async function handleDelete() {
        let response = await fetch('/api/admin/game', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: game?._id.toString() })
        })
        const data = await response.json();
        if (data.msg) {
            return dispatch({ type: "SUCCESS", payload: data.msg })
        }
        if (data.error) {
            setErrors([data.error])
            setTimeout(() => {
                setErrors([])
            }, 3500)
        }
    }

    function handleSubmit() {
        let map = [
            [gameState.title, "Title"],
            [gameState.cover, "Cover"],
            [gameState.releaseDate, "Release Date"],
            [gameState.developerId, "Developer"],
            [gameState.publisherId, "Publisher"],
            [gameState.summary, "Summary"]
        ] as const

        let errors: string[] = []
        for (let tuple of map) {
            if (!tuple[0]) errors.push(`${tuple[1]} field is missing`)
        }

        if (errors.length == 0) return send()

        setErrors(errors);
        setTimeout(() => {
            setErrors([])
        }, 3500)
    }

    return (
        <>
            <AnimatePresence >
                {errors.length > 0 &&
                    <Popup className={styles.errors} >
                        {errors.map(err =>
                            <p key={err} >
                                {`${err}`}
                            </p>)}
                    </Popup>}
            </AnimatePresence>
            <h2 style={{ textAlign: 'center' }} >{isDelete ? "Delete Game" : game ? "Edit Game" : "Add Game"}</h2>
            <div className={styles.change} >
                <div className={styles.img}><img src={gameState.cover} alt="" /></div>
                <form >
                    <FormInputString dispatch={gameDispatch} isDelete={isDelete} name='title' value={gameState.title} />
                    <FormInputString dispatch={gameDispatch} isDelete={isDelete} name='cover' value={gameState.cover} />
                    <FormInputString dispatch={gameDispatch} isDelete={isDelete} name='banner' value={gameState.banner || ""} />
                    <div>
                        <label> Release Date* </label>
                        <input
                            name="releaseDate"
                            type="date"
                            value={gameState.releaseDate ? formatDateForInputElement(new Date(gameState.releaseDate)) : ""}
                            onChange={e => gameDispatch({ type: 'UPDATE_STRING', payload: { name: 'releaseDate', value: e.target.value } })}
                            placeholder="Release Date" disabled={isDelete} />
                    </div>
                    <SelectElement dispatch={gameDispatch} isDelete={isDelete} list={devs} name='developerId' value={gameState.developerId} title='Developer' />
                    <SelectElement dispatch={gameDispatch} isDelete={isDelete} list={pubs} name='publisherId' value={gameState.publisherId} title='Publisher' />
                    <div>
                        <label> Summary* </label>
                        <textarea
                            defaultValue={gameState.summary}
                            onChange={e => gameDispatch({ type: 'UPDATE_STRING', payload: { name: 'summary', value: e.target.value } })}
                            disabled={isDelete} />
                    </div>
                    <FormInputString dispatch={gameDispatch} isDelete={isDelete} name='trailer' value={gameState.trailer || ""} />
                    <div>
                        <label > Genres </label>
                        <input
                            value={genreInput}
                            onChange={e => setGenreInput(e.target.value)}
                            onKeyDownCapture={handleKeydown}
                            disabled={isDelete} />
                    </div>
                    <Tags tags={gameState.genres} changeTags={gameDispatch} />
                    <div className={styles.checkboxes}>
                        {platforms.map(item => (
                            <div key={item._id.toString()} >
                                <label > {item.name} </label>
                                <input
                                    type="checkbox"
                                    checked={gameState.platformIds.includes(item._id.toString())}
                                    disabled={isDelete}
                                    onChange={() => {
                                        if (gameState.platformIds.includes(item._id.toString())) {
                                            gameDispatch({ type: 'REMOVE_FROM_ARRAY', payload: { name: 'platformIds', value: item._id.toString() } })
                                        } else {
                                            gameDispatch({ type: 'ADD_TO_ARRAY', payload: { name: 'platformIds', value: item._id.toString() } })
                                        }
                                    }} />
                            </div>
                        ))}
                    </div>
                    {isDelete &&
                        <>
                            <label htmlFor=""> Deleting is irreversible. Type <strong>{gameState.title}</strong> to confirm </label>
                            <input className={styles.challenge} value={challengeAnswer} onChange={e => setChallengeAnswer(e.target.value)} />
                        </>
                    }
                    {isDelete ?
                        <button className="danger" type="button" onClick={handleDelete} disabled={challengeAnswer != gameState.title} > Delete </button> :
                        <button type="button" className="add" onClick={handleSubmit} >Submit</button>
                    }
                </form>
                <div className={styles.img}><img src={gameState.banner} alt="" /></div>
            </div>
        </>
    )
}

interface P {
    name: keyof GameUpdateState,
    value: string,
    title?: string,
    isDelete: boolean,
    dispatch: Dispatch<GameReducerAction>
}

function FormInputString(props: P) {
    const { name, isDelete, dispatch, value } = props;
    const title = props.title || titleCase(name)

    return (
        <div>
            <label> {title} </label>
            <input type="text"
                value={value}
                name={name}
                onChange={e => dispatch({ type: 'UPDATE_STRING', payload: { name, value: e.target.value } })}
                placeholder={title}
                disabled={isDelete} />
        </div>
    )
}

function SelectElement(props: P & { list: IPub[] | IDev[] }) {
    const { name, isDelete, dispatch, value, list } = props;
    const title = props.title || titleCase(name)
    return (
        <div>
            <label> {title}* </label>
            <select
                value={value}
                name={name}
                onChange={(e) => dispatch({ type: 'UPDATE_STRING', payload: { name, value: e.target.value } })}
                disabled={isDelete}
            >
                <option value="" disabled >Select {title}</option>
                {list.map(item =>
                    <option key={item._id.toString()} value={item._id.toString()}> {item.name} </option>
                )}
            </select>
        </div>
    )
}