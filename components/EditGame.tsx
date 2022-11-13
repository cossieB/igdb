import { AnimatePresence } from "framer-motion";
import { Dispatch, useReducer, useState } from "react";
import Tags from "./Tags";
import styles from '../styles/dashboard.module.scss'
import Popup from "./Popup";
import { Actions } from "../utils/adminReducerTypes";
import { marked } from "marked";
import gameReducer, { GameReducerAction } from "../utils/gameReducer";
import { GameUpdateState, initialGameUpdateState } from "../utils/initialGameState";
import titleCase from "../utils/titleCase";
import { Game, Publisher, Developer, Platform, GamesOnPlatforms, GenresOfGames } from "@prisma/client";
import sendData from "../utils/sendData";
import { Optional } from "../utils/utilityTypes";
import { changeType } from "../utils/changeType";
import { FormInputString, SelectElement } from "./FormInputElements";

interface Props {
    game: Game | null,
    pubs: Publisher[],
    devs: Developer[],
    platforms: Platform[],
    games: Game[],
    gamesOnPlatforms: GamesOnPlatforms[],
    genresOfGames: GenresOfGames[]
    isDelete: boolean,
    dispatch: React.Dispatch<Actions>
}
export default function EditGame(props: Props) {
    const {  pubs, devs, platforms, isDelete, dispatch, gamesOnPlatforms, games, game, genresOfGames } = props;
    const [genreInput, setGenreInput] = useState("")
    const [errors, setErrors] = useState<string[]>([])
    const [challengeAnswer, setChallengeAnswer] = useState("");

    const [gameState, gameDispatch] = useReducer(gameReducer, changeType(game, gamesOnPlatforms, genresOfGames) || initialGameUpdateState);
    
    function handleKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == "Enter") {
            if (genreInput.length == 0 || gameState.genres.includes(genreInput)) return;
            gameDispatch({ type: 'ADD_TO_ARRAY', payload: { name: 'genres', value: genreInput.toLowerCase() } })
            setGenreInput("")
        }
    }
    async function send() {
        const method = game ? "PUT" : "POST"
        const body = {
            ...gameState,
            releaseDate: new Date(gameState.releaseDate),
            title: gameState.title.trim(),
            summary: marked(gameState.summary)
        }
        const data = await sendData('/api/admin/game', method, body)

        if ('msg' in data) {
            // Add object to state or edit existing object in state.
            if (game) {
                
                deleteFromArray(gamesOnPlatforms, game);
                deleteFromArray(genresOfGames, game);
                
                const toEdit: Optional<GameUpdateState, 'platformIds'> = {...gameState}
                delete toEdit.platformIds
                const gopToPush: GamesOnPlatforms[] = gameState.platformIds.map(platformId => ({gameId: gameState.gameId, platformId}))
                const gogToPush: GenresOfGames[] = gameState.genres.map(genre => ({gameId: gameState.gameId, genre}))
                Object.assign(game, toEdit)
                gamesOnPlatforms.push(...gopToPush)
                genresOfGames.push(...gogToPush)
            }
            else {
                const toPush: Optional<GameUpdateState, 'platformIds'> = {...gameState, gameId: data.gameId}
                delete toPush.platformIds
                games.push(toPush)
                const gopToPush: GamesOnPlatforms[] = gameState.platformIds.map(platformId => ({gameId: data.gameId, platformId}))
                gamesOnPlatforms.push(...gopToPush)
                const gogToPush: GenresOfGames[] = gameState.genres.map(genre => ({gameId: data.gameId, genre}))
                genresOfGames.push(...gogToPush)
            }
            return dispatch({ type: "SUCCESS", payload: data.msg })
        }
        if ('error' in data) {
            setErrors([data.error])
            setTimeout(() => {
                setErrors([])
            }, 3500)
        }
    }
    async function handleDelete() {
        const data = await sendData('/api/admin/game', 'DELETE', {gameId: gameState.gameId})
        if (data.msg) {
            
            // Remove game object from the list of games and from the junction table data.
            const start = gamesOnPlatforms.findIndex(item => item.gameId == game!.gameId)
            let index = start;
            let count = 0
            while (gamesOnPlatforms[index].gameId == game!.gameId && index < gamesOnPlatforms.length - 1) {
                count++
                index++
            }
            gamesOnPlatforms.splice(start, count)     
            const i = games.findIndex(item => item.gameId == game!.gameId)
            games.splice(i, 1)
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
        if (gameState.platformIds.length == 0) errors.push("Please select at least 1 platform")
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
                    <FormInputString dispatch={gameDispatch} isDelete={isDelete} name='releaseDate' value={gameState.releaseDate.toString()} title="Release Date*" />
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
                            <div key={item.platformId} >
                                <label > {item.name} </label>
                                <input
                                    type="checkbox"
                                    checked={gameState.platformIds.includes(item.platformId)}
                                    disabled={isDelete}
                                    onChange={() => {
                                        if (gameState.platformIds.includes(item.platformId)) {
                                            gameDispatch({ type: 'REMOVE_FROM_ARRAY', payload: { name: 'platformIds', value: item.platformId } })
                                        } else {
                                            gameDispatch({ type: 'ADD_TO_ARRAY', payload: { name: 'platformIds', value: item.platformId } })
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

function deleteFromArray(array: {gameId: string}[], game: Game) {
    // Delete elements matching gameId from array. Array is sorted
    const start = array.findIndex(item => item.gameId == game.gameId);
    let index = start;
    let count = 0;
    while (array[index].gameId == game.gameId && index < array.length - 1) {
        count++;
        index++;
    }
    array.splice(start, count);
}
