import { SetStateAction } from "react";
import { marked } from 'marked';
import  { useRouter } from "next/router";
marked.setOptions({ breaks: true, gfm: true})

interface Props {
    text: string,
    changeText: React.Dispatch<SetStateAction<string>>,
    className?: string,
    id: string
}

export default function Textarea(props: Props) {
    const { text, changeText, className, id } = props;
    const router = useRouter()
    async function go() {
        const res = await (await fetch('/api/change', {
            method: "POST",
            body: JSON.stringify({id, text: marked(text)}),
            headers: {
                "Content-Type": "application/json"
            }
        })).json()
        if (res.msg == 'ok') router.reload()
    }
    return (
        <div>
            <textarea
                className={className || ""}
                defaultValue={text || ""}
                onChange={e => changeText(e.target.value)}
            />

            <button onClick={go}>Go</button>
            <div dangerouslySetInnerHTML={{__html: marked(text)}} />
        </div>
    )
}