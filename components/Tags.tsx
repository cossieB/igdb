import Link from "next/link"
import { Dispatch } from "react"
import { GameReducerAction } from "../utils/gameReducer"
import { closeSvg } from "../utils/svgs"

interface P {
    tags: string[],
    changeTags?: Dispatch<GameReducerAction>,
    isLink?: boolean
}

export default function Tags({ tags, changeTags, isLink }: P) {
    return (

        <div className="tags">
            {isLink ?
                tags.map((tag, idx) =>
                    <Link href={`/tags/${tag}`} key={tag + idx} >
                        <a>
                            <span>{tag} </span>
                            {changeTags &&
                                <span onClick={() => changeTags({ type: 'REMOVE_FROM_ARRAY', payload: { name: 'genres', value: tag } })} >
                                    {closeSvg}
                                </span>}
                        </a>
                    </Link>
                ) :
                tags.map((tag, idx) =>
                    <div key={tag + idx} >
                            <span>{tag} </span>
                            {changeTags &&
                                <span onClick={() => changeTags({ type: 'REMOVE_FROM_ARRAY', payload: { name: 'genres', value: tag } })} >
                                    {closeSvg}
                                </span>}
                    </div>
                )
        }
        </div>
    )
}