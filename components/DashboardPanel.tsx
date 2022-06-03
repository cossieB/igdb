import { Dispatch } from "react"
import { GameDoc } from "../models/game"
import { Actions, Models, TypesWithPayload } from "../utils/adminReducerTypes";
import styles from '../styles/dashboard.module.scss'
import { PubDoc } from "../models/publisher";
import { DevDoc } from "../models/developers";

interface P {
    displayField: string,
    dispatch: Dispatch<Actions>,
    h2: "Games" | "Developers" | "Publishers" | "Platforms",
    items: GameDoc[] | PubDoc[] | DevDoc[]
}

export default function Panel(props: P) {
    const {dispatch, h2} = props;
    function handleAdd() {
        if (h2 == "Games") dispatch({type: "ADD_GAME"})
        if (h2 == "Developers") dispatch({type: "ADD_DEV"})
        if (h2 == "Publishers") dispatch({type: "ADD_PUB"}) 
    }
    return (
        <div className={styles.panel} >
            <div className={styles.header} >
                <h2> {h2} </h2>
                <button onClick={handleAdd} className="add" >Add</button>
            </div>
            <List {...props} />
        </div>
    )
}

function List(props: P) {
    const { displayField, dispatch, h2, items } = props;

    function handleEdit(item: Models) {
        let map: { [key: string]: TypesWithPayload } = {
            "Games": "EDIT_GAME",
            "Developers": "EDIT_DEV",
            "Publishers": "EDIT_PUB"
        }
        const action: Actions = {
            type: map[h2],
            // @ts-expect-error
            payload: item
        };
        dispatch(action)
    }
    function handleDelete(item: Models) {
        let map: { [key: string]: TypesWithPayload } = {
            "Games": "REMOVE_GAME",
            "Developers": "REMOVE_DEV",
            "Publishers": "REMOVE_PUB"
        }
        const action: Actions = {
            type: map[h2],
            // @ts-expect-error
            payload: item
        };
        dispatch(action)
    }
    return (
        <>
            {items.map(item =>
                <div className={styles.row}
                    /* @ts-expect-error */
                    key={item[displayField]} >
                    {/* @ts-expect-error */}
                    <div>{item[displayField]}</div>
                    <div>
                        <button className="info" onClick={() => handleEdit(item as Models)} >
                            Edit
                        </button>
                        <button className="danger" onClick={() => handleDelete(item as Models)}  >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}