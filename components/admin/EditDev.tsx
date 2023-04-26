import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import styles from '../styles/dashboard.module.scss'
import Popup from "../Popup";
import { Actions } from "../../utils/adminReducerTypes";
import { countryList } from "../../utils/countryList";
import { marked } from "marked";
import { Developer } from "@prisma/client";
import sendData from "../../lib/sendData";
import { Optional } from "../../lib/utilityTypes";

interface Props {
    dev: Developer | null,
    isDelete?: boolean,
    dispatch: React.Dispatch<Actions>
    developers: Developer[]
}
export default function EditDev(props: Props) {
    const { dev, isDelete, dispatch, developers } = props;
    const [name, setName] = useState(dev?.name || "")
    const [summary, setSummary] = useState(dev?.summary || "")
    const [logo, setLogo] = useState(dev?.logo || "")
    const [location, setLocation] = useState(dev?.location || "")
    const [country, setCountry] = useState(dev?.country || "")
    const [errors, setErrors] = useState<string[]>([])
    const [challengeAnswer, setChallengeAnswer] = useState("");

    async function send() {
        const method = dev?.developerId ? "PUT" : "POST"
        const body: Optional<Developer, 'developerId'> = { name: name.trim(), summary: marked(summary), logo, location, country, developerId: dev?.developerId }
        const data = await sendData('/api/admin/dev', method, body)

        if (data.msg) {
            if (dev) {
                Object.assign(dev, { country, location, summary, logo, name })
            }
            else {
                const toPush: Developer = {
                    developerId: data.developerId,
                    country,
                    location,
                    summary,
                    logo,
                    name
                }
                developers.push(toPush)
            }
            return dispatch({ type: "SUCCESS", payload: data.msg })
        }
        if (data.error) {
            setErrors([data.error]);
            setTimeout(() => {
                setErrors([])
            }, 3500)
        }
    }
    async function handleDelete() {
        const data = await sendData('/api/admin/dev', 'DELETE', { developerId: dev!.developerId })
        if (data.msg) {
            const index = developers.findIndex(item => item.developerId == dev!.developerId)
            developers.splice(index, 1)
            return dispatch({ type: "SUCCESS", payload: data.msg })
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
            [location, "Location"],
            [summary, "Summary"],
            [country, "Country"]
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
            <h2 style={{ textAlign: 'center' }} >{isDelete ? "Delete Developer" : dev ? "Edit Developer" : "Add Developer"}</h2>
            <div className={styles.change} >
                <form >
                    <div>
                        <label> Name* </label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Developer Name" disabled={isDelete} />
                    </div>
                    <div>
                        <label> Logo* </label>
                        <input type="text" value={logo} onChange={e => setLogo(e.target.value)} placeholder="Cover" disabled={isDelete} />
                    </div>
                    <div>
                        <label> Location* </label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" disabled={isDelete} />
                    </div>
                    <div>
                        <label> Country* </label>
                        <select
                            value={country}
                            defaultValue=""
                            onChange={(e) => setCountry(e.target.value)}
                            disabled={isDelete}
                        >
                            <option value="" disabled >Select Country</option>
                            {countryList.map(item =>
                                <option key={item} value={item}> {item} </option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label> Summary* </label>
                        <textarea defaultValue={summary} onChange={e => setSummary(e.target.value)} disabled={isDelete} />
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