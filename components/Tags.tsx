import { SetStateAction } from "react"
import { closeSvg } from "../utils/svgs"

interface P {
    tags: string[],
    changeTags?: React.Dispatch<SetStateAction<string[]>>
}

export default function Tags({ tags, changeTags }: P) {
    return (

        <div className="tags">
            {tags.map((tag, idx) =>
                <div >
                    <span>{tag} </span>
                    {changeTags &&
                        <span onClick={() => changeTags(tags.filter(item => tags.indexOf(item) != idx))} >
                            {closeSvg}
                        </span>}
                </div>
            )}
        </div>
    )
}