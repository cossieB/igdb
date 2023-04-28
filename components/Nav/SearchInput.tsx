"use client";
import { useEffect, useRef } from "react";
import debounce from "../../lib/debounce";
import { useRouter, usePathname } from "next/navigation";

type Props = {
    setIsFocused: React.Dispatch<React.SetStateAction<boolean>>
    isFocused: boolean
}

export default function SearchInput(props: Props) {
    const { setIsFocused, isFocused } = props
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (isFocused)
            ref.current!.focus()
    }, [isFocused])
    
    const router = useRouter()
    const pathname = usePathname()!
    const search = debounce((text: string) => {
        navigate(text);
    }, 1000)

    useEffect(() => {
        document.addEventListener('keyup', handleEnter)
        return () => document.removeEventListener('keyup', handleEnter)
    }, [ref.current?.value])

    function navigate(text: string) {console.log(pathname)
        if (text == "") {
            router.back();
        }
        else if (pathname == "/search") {
            router.replace(`/search?q=${text}`);
        }
        else {
            router.push(`/search?q=${text}`);
        }
    }

    function handleEnter(e: KeyboardEvent) {
        if (e.key == "Enter" && ref.current!.value.length > 0) {
            navigate(ref.current!.value)
            ref.current!.blur()
        }
    }
    return (
        <input
            ref={ref}
            type="text"
            name="search"
            id="search"
            required
            placeholder=" "
            onChange={e => {
                search(e.target.value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
                setIsFocused(false);
                ref.current!.value = ""
            }} />
    );
}
