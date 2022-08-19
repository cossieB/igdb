import { Dispatch } from "react"
import { GameReducerAction } from "../utils/gameReducer"
import { closeSvg } from "../utils/svgs"

interface P {
    tags: string[],
    changeTags?: Dispatch<GameReducerAction>
}

export default function Tags({ tags, changeTags }: P) {
    return (

        <div className="tags">
            {tags.map((tag, idx) =>
                <div key={tag + idx} >
                    <span>{tag} </span>
                    {changeTags && 
                        <span onClick={() => changeTags({type: 'REMOVE_FROM_ARRAY', payload: {name: 'genres', value: tag}}) } >
                            {closeSvg}
                        </span>} 
                </div>
            )}
        </div>
    )
}