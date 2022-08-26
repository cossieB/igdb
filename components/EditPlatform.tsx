import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import styles from '../styles/dashboard.module.scss'
import Popup from "./Popup";
import { Actions } from "../utils/adminReducerTypes";
import { marked } from "marked";
import { formatDateForInputElement } from "../utils/formatDate";
import { Platform } from "@prisma/client";
import { Optional } from "../utils/utilityTypes";
import sendData from "../utils/sendData";

interface Props {
    platform: Platform | null,
    isDelete: boolean
    dispatch: React.Dispatch<Actions>
    platforms: Platform[]
}
export default function EditPlatform(props: Props) {
    const { platform, isDelete, dispatch, platforms } = props;
    const [name, setName] = useState(platform?.name || "")
    const [summary, setSummary] = useState(platform?.summary || "")
    const [logo, setLogo] = useState(platform?.logo || "")
    const [releaseDate, setReleaseDate] = useState(platform?.release || new Date())
    const [errors, setErrors] = useState<string[]>([])
    const [challengeAnswer, setChallengeAnswer] = useState("");

    async function send() {
        const method = platform?.platformId ? "PUT": "POST"
        const body: Optional<Platform, 'platformId'> = { name: name.trim(),summary: marked(summary), logo,  platformId: platform?.platformId, release: releaseDate }
        const data = await sendData('/api/admin/platform', method, body)
        if (data.msg) {
            if (platform) {
                Object.assign(platform, { releaseDate, summary, logo, name })
            }
            else {
                const toPush: Platform = {
                    platformId: data.platformId,
                    release: releaseDate,
                    summary,
                    logo,
                    name
                }
                platforms.push(toPush)
            }
            return dispatch({type: "SUCCESS", payload: data.msg})
        }
        if (data.error) {
            setErrors([data.error]);
            setTimeout(() => {
                setErrors([])
            }, 3500)
        }
    }
    async function handleDelete() {
        const data = await sendData('/api/admin/platform', 'DELETE', {platformId: platform?.platformId})
        if (data.msg) {
            const index = platforms.findIndex(item => item.platformId == platform!.platformId)
            platforms.splice(index, 1)
            return dispatch({type: "SUCCESS", payload: data.msg})
        }
        if (data.error) {
            setErrors([data.error]);
            setTimeout(() => {
                setErrors([])
            }, 3500)
        }
    }

    function handleSubmit() {
        let map = [
            [name, "Name"],
            [logo, "Logo"],
            [summary, "Summary"],
            [releaseDate, "Release Date"]
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
                                {err}
                            </p>)}
                    </Popup>}
            </AnimatePresence>
            <h2 style={{ textAlign: 'center' }} >{isDelete? "Delete Platform" : platform ? "Edit Platform" : "Add Platform"}</h2>
            <div className={styles.change} >
                <form >
                    <div>
                        <label> Name* </label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Platform Name" disabled={isDelete} />
                    </div>
                    <div>
                        <label> Logo* </label>
                        <input type="text" value={logo} onChange={e => setLogo(e.target.value)} placeholder="Logo" disabled={isDelete} />
                    </div>
                    <div>
                        <label> Summary* </label>
                        <textarea defaultValue={summary} onChange={e => setSummary(e.target.value)} disabled={isDelete} />
                    </div>
                    <div>
                        <label> Release Date* </label>
                        <input type="date" value={releaseDate ? formatDateForInputElement(new Date(releaseDate)) : ""} onChange={e => setReleaseDate(new Date(e.target.value))} placeholder="Release Date" disabled={isDelete}/>
                    </div>
                    {isDelete &&
                        <>
                            <label htmlFor=""> Deleting is irreversible. Type <strong>{name}</strong> to confirm </label>
                            <input className={styles.challenge} value={challengeAnswer} onChange={e => setChallengeAnswer(e.target.value)} />
                        </>
                    }
                    {isDelete ?
                        <button className="danger" type="button" onClick={handleDelete} disabled={challengeAnswer != name} > Delete </button> :
                        <button type="button" className="add" onClick={handleSubmit} >Submit</button>
                    }
                </form>
            </div>
        </>
    )
}