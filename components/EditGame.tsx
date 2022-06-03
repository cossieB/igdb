import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { DevDoc } from "../models/developers";
import { GameDoc } from "../models/game";
import { PlatformDoc } from "../models/platform";
import { PubDoc } from "../models/publisher";
import Tags from "./Tags";
import styles from '../styles/dashboard.module.scss'
import Popup from "./Popup";
import { formatDateForInputElement } from "../utils/formatDate";
import { Actions } from "../utils/adminReducerTypes";
import { marked } from "marked";
import { UpsertResult } from "../utils/customTypes";

interface Props {
    game: GameDoc | null,
    pubs: PubDoc[],
    devs: DevDoc[],
    platforms: PlatformDoc[],
    isDelete: boolean,
    dispatch: React.Dispatch<Actions>
}
export default function EditGame(props: Props) {
    const { game, pubs, devs, platforms, isDelete, dispatch } = props; 
    const [title, setTitle] = useState(game?.title || "")
    const [summary, setSummary] = useState(game?.summary || "")
    const [cover, setCover] = useState(game?.cover || "")
    const [banner, setBanner] = useState(game?.banner || "")
    const [date, setDate] = useState(game?.releaseDate)
    const [developer, setDeveloper] = useState(game?.developer?._id?.toString() || "")
    const [publisher, setPublisher] = useState(game?.publisher?._id?.toString() || "" )
    const [genres, setGenres] = useState(game?.genres || []);
    const [genreInput, setGenreInput] = useState("")
    const [ports, setPorts] = useState<string[]>(game?.platforms?.map(item => item._id.toString()) || [] )
    const [errors, setErrors] = useState<string[]>([])
    const [challengeAnswer, setChallengeAnswer] = useState("");

    function handleKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == "Enter") {
            if (genreInput.length == 0) return
            setGenres([...genres, genreInput.toLowerCase()]);
            setGenreInput("")
        }
    }
    async function send() {

        const response = await fetch('/api/admin/game', {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ title: title.trim(), summary: marked(summary), cover, banner, date, developer, publisher, genres, ports, id: game?._id?.toString(), type: "game" })
        })
        const data = await response.json();
        if (data.msg) {
            return dispatch({type: "SUCCESS", payload: data.msg})
        }
        if (data.error) {
            setErrors(data.error)
        }
    }
    async function handleDelete() {
        let response = await fetch('/api/admin/game', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: game?._id.toString()})
        })
        const data = await response.json() ;
        if (data.msg) {
            return dispatch({type: "SUCCESS", payload: data.msg})
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
            [title, "Title"],
            [cover, "Cover"],
            [date, "Release Date"],
            [developer, "Developer"],
            [publisher, "Publisher"],
            [summary, "Summary"]
        ] as const
        let arr: string[] = []
        for (let tuple of map) {
            if (!tuple[0]) arr.push(tuple[1] + " field is missing")
        }
        if (arr.length == 0) return send()

        setErrors(arr);
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
            <h2 style={{textAlign: 'center'}} >{ isDelete ? "Delete Game" : game ? "Edit Game" : "Add Game"}</h2>
            <div className={styles.change} >
                <div className={styles.img}><img src={cover} alt="" /></div>
                <form >
                    <div>
                        <label> Title* </label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Game Title" disabled={isDelete}/>
                    </div>
                    <div>
                        <label> Cover* </label>
                        <input type="text" value={cover} onChange={e => setCover(e.target.value)} placeholder="Cover" disabled={isDelete}/>
                    </div>
                    <div>
                        <label> Banner </label>
                        <input type="text" value={banner} onChange={e => setBanner(e.target.value)} placeholder="Banner" disabled={isDelete}/>
                    </div>
                    <div>
                        <label> Release Date* </label>
                        <input type="date" value={date ? formatDateForInputElement(new Date(date)) : ""} onChange={e => setDate(e.target.value)} placeholder="Release Date" disabled={isDelete}/>
                    </div>
                    <div>
                        <label> Developer* </label>
                        <select
                            value={developer}
                            defaultValue=""
                            onChange={(e) => setDeveloper(e.target.value)} 
                            disabled={isDelete}
                            >
                            <option value="" disabled >Select Developer</option>
                            {devs.map(dev =>
                                <option key={dev._id.toString()} value={dev._id.toString()}> {dev.name} </option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label> Publisher* </label>
                        <select
                            value={publisher}
                            defaultValue=""
                            onChange={(e) => setPublisher(e.target.value)} 
                            disabled={isDelete}
                            >
                            <option value="" disabled  >Select Publisher</option>
                            {pubs.map(pub =>
                                <option key={pub._id.toString()} value={pub._id.toString()}> {pub.name} </option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label> Summary* </label>
                        <textarea defaultValue={summary} onChange={e => setSummary(e.target.value)} disabled={isDelete}/>
                    </div>
                    <div>
                        <label > Genres </label>
                        <input value={genreInput} onChange={e => setGenreInput(e.target.value)} onKeyDownCapture={handleKeydown} disabled={isDelete}/>
                    </div>
                    <Tags tags={genres} changeTags={setGenres} />
                    <div className={styles.checkboxes}>
                        {platforms.map(item => (
                            <div key={item._id.toString()} >
                                <label > {item.name} </label>
                                <input
                                    type="checkbox"
                                    checked={ports.includes(item._id.toString())}
                                    disabled={isDelete}
                                    onChange={() => {
                                        if (ports.includes(item._id.toString())) {
                                            setPorts(ports.filter(p => p != item._id.toString()))
                                        } else {
                                            setPorts([...ports, item._id.toString()])
                                        }
                                    }} />
                            </div>
                        ))}
                    </div>
                    { isDelete && 
                        <>
                        <label htmlFor=""> Deleting is irreversible. Type <strong>{title}</strong> to confirm </label>
                        <input value={challengeAnswer} onChange={e => setChallengeAnswer(e.target.value) } /> 
                        </>
                    }
                    {isDelete ?
                    <button className="danger" type="button" onClick={handleDelete} disabled={challengeAnswer != title} > Delete </button> :
                    <button type="button" className="add" onClick={handleSubmit} >Submit</button>  
                    }
                </form>
                <div className={styles.img}><img src={banner} alt="" /></div>
            </div>
        </>
    )
}