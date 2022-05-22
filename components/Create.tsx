import { Fragment, useState } from "react"

interface Props {
    obj: {[key: string]: string}
}

export default function Create({obj}: Props) {
    const [keys] = useState(Object.keys(obj))
    return (
        <form>
            { keys.map(key => (
                <Fragment key={key}  >
                <label htmlFor={key}>{key}</label>
                <input type="text" placeholder={key} />
                </Fragment>
            )) }
        </form>
    )
}