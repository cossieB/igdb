"use client"

import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { SearchSvg } from "../../utils/svgs"
import { AnimatePresence, motion } from "framer-motion"
import SearchInput from "./SearchInput"

type Props = {
    navbar: RefObject<HTMLElement>,
    isFocused: boolean,
    setIsFocused: Dispatch<SetStateAction<boolean>>
}

export default function Search(props: Props) {
    const { isFocused, navbar, setIsFocused } = props
    const ref = useRef<HTMLInputElement>(null)


    return (
        <div
            onClick={() => setIsFocused(true)}
            className="navItem">
            <span className="navIcon" >
                {<SearchSvg />}
            </span>
            <span className="formControl navText">
                <SearchInput setIsFocused={setIsFocused} isFocused={isFocused}/>
                <label htmlFor="search">Search</label>
            </span>
            {isFocused &&
                createPortal(<div onClick={() => setIsFocused(false)} className="mask" />, document.querySelector('main')!)
            }
        </div>
    )
}

