"use client"

import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { searchSvg } from "../../utils/svgs"
import { AnimatePresence, motion } from "framer-motion"

type Props = {
    navbar: RefObject<HTMLElement>,
    isFocused: boolean,
    setIsFocused: Dispatch<SetStateAction<boolean>>
}

export default function Search(props: Props) {
    const { isFocused, navbar, setIsFocused } = props
    const ref = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (isFocused)
            ref.current!.focus()
    }, [isFocused])

    return (
        <div
            onClick={() => setIsFocused(true)}
            className="navItem">
            <span className="navIcon" >
                {searchSvg}
            </span>
            <span className="formControl navText">
                <input
                    ref={ref}
                    type="text"
                    name="search"
                    id="search"
                    required
                    placeholder=" "
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <label htmlFor="search">Search</label>
            </span>
            {isFocused &&
                createPortal(<div onClick={() => setIsFocused(false)} className="mask" />, document.querySelector('main')!)
            }
        </div>
    )
}
