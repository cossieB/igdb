import { Dispatch } from "react"
import { Actions, ActionWithPayload, Models, Tables, TypesWithPayload } from "../../utils/adminReducerTypes";
import styles from '../styles/dashboard.module.scss'
import { Game, Publisher, Developer, Platform } from "@prisma/client";

interface P {
    displayField: string,
    dispatch: Dispatch<Actions>,
    h2: `${Tables}s`,
    items: Game[] | Publisher[] | Developer[] | Platform[]
}

export default function Panel(props: P) {
    const {dispatch, h2} = props;
    function handleAdd() {
        if (h2 == "Games") dispatch({type: "ADD_GAME"})
        if (h2 == "Developers") dispatch({type: "ADD_DEVELOPER"})
        if (h2 == "Publishers") dispatch({type: "ADD_PUBLISHER"}) 
        if (h2 == "Platforms") dispatch({type: "ADD_PLATFORM"}) 
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

    function handleDispatch(item: Models, isEdit: boolean) {

        type Test = {
            [k in `${Tables}s`]: TypesWithPayload
        }
        let map: Test
        
        if (isEdit) {
            map = {
                "Games": "EDIT_GAME",
                "Developers": "EDIT_DEVELOPER",
                "Publishers": "EDIT_PUBLISHER",
                "Platforms": "EDIT_PLATFORM",
                "Actors": "EDIT_ACTOR"
            };
        }
        else {
            map = {
                "Games": "REMOVE_GAME",
                "Developers": "REMOVE_DEVELOPER",
                "Publishers": "REMOVE_PUBLISHER",
                "Platforms": "REMOVE_PLATFORM",
                "Actors": "REMOVE_ACTOR"
            }
        }
        const action: ActionWithPayload = {
            type: map[h2],
            payload: item
        };
        dispatch(action as Actions);
    }

    return (
        <>
            {items?.map(item =>
                <div className={styles.row}
                    /* @ts-expect-error */
                    key={item[displayField]} >
                    {/* @ts-expect-error */}
                    <div>{item[displayField]}</div>
                    <div>
                        <button className="info" onClick={() => handleDispatch(item as Models, true)} >
                            Edit
                        </button>
                        <button className="danger" onClick={() => handleDispatch(item as Models, false)}  >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}