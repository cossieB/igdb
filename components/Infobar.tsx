import { Developer, Game, Publisher } from "@prisma/client"

interface Props {
    obj: Game | Developer | Publisher
}

export default function Infobar({obj}: Props) {
    let keys = Object.keys(obj)
    /*@ts-expect-error*/
    keys = keys.filter(item => typeof obj[item] != "object" && item != 'id' && item != 'summary')
    return (
        <div>
            {keys.map(key => (
                <div key={key} >
                    <div> {key} </div> 
                    { /*@ts-expect-error*/ }
                    <div>{  obj[key]  } </div>
                </div>
            ))}
        </div>
    )
}