import { Publisher, Developer } from "@prisma/client";
import { Dispatch } from "react";
import { formatDateForInputElement } from "../utils/formatDate";
import { GameReducerAction } from "../utils/gameReducer";
import { GameUpdateState } from "../utils/initialGameState";
import titleCase from "../utils/titleCase";

export interface P {
    name: keyof GameUpdateState,
    value: string,
    title?: string,
    isDelete: boolean,
    dispatch: Dispatch<GameReducerAction>
}

export function FormInputString(props: P) {
    const { name, isDelete, dispatch, value } = props;
    const title = props.title || titleCase(name);

    return (
        <div>
            <label> {title} </label>
            <input
                type={name != "releaseDate" ? 'text' : 'date'}
                value={name != "releaseDate" ? value : formatDateForInputElement(new Date(value))}
                name={name}
                onChange={e => dispatch({ type: 'UPDATE_STRING', payload: { name, value: e.target.value } })}
                placeholder={title}
                disabled={isDelete}
                autoComplete="off"
            />
        </div>
    );
}

export function SelectElement(props: P & { list: Publisher[] | Developer[] }) {
    const { name, isDelete, dispatch, value, list } = props;
    const title = props.title || titleCase(name)

    return (
        <div>
            <label> {title}* </label>
            <select
                value={value}
                name={name}
                onChange={(e) => dispatch({ type: 'UPDATE_STRING', payload: { name, value: e.target.value } })}
                disabled={isDelete}
            >
                <option value="" disabled >Select {title}</option>
                {list.map(item =>
                    <option
                        key={'publisherId' in item ? item.publisherId : item.developerId}
                        value={'publisherId' in item ? item.publisherId : item.developerId}
                    >
                        {item.name}
                    </option>
                )}
            </select>
        </div>
    )
}