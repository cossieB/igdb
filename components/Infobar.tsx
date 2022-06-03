import { IDev } from "../models/developers";
import { IGame } from "../models/game";
import { IPub } from "../models/publisher";

interface Props {
    obj: IGame | IDev | IPub
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