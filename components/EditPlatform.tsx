import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import styles from '../styles/dashboard.module.scss'
import Popup from "./Popup";
import { Actions } from "../utils/adminReducerTypes";
import { marked } from "marked";
import { IPlatform } from "../models/platform";
import { formatDateForInputElement } from "../utils/formatDate";

interface Props {
    platform: IPlatform | null,
    isDelete: boolean
    dispatch: React.Dispatch<Actions>
}
export default function EditPlatform(props: Props) {
    const { platform, isDelete, dispatch } = props;
    const [name, setName] = useState(platform?.name || "")
    const [summary, setSummary] = useState(platform?.summary || "")
    const [logo, setLogo] = useState(platform?.logo || "")
    const [releaseDate, setReleaseDate] = useState(platform?.release)
    const [errors, setErrors] = useState<string[]>([])
    const [challengeAnswer, setChallengeAnswer] = useState("");

    async function send() {

        const response = await fetch('/api/admin/platform', {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ name: name.trim(),summary: marked(summary), logo,  id: platform?._id?.toString(), release: releaseDate })
        })
        const data = await response.json();
        if (data.msg) {
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
        const response = await fetch('/api/admin/platform', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: platform?._id.toString() })
        })
        const data = await response.json();
        if (data.msg) {
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
                        <input type="date" value={releaseDate ? formatDateForInputElement(new Date(releaseDate)) : ""} onChange={e => setReleaseDate(e.target.value)} placeholder="Release Date" disabled={isDelete}/>
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