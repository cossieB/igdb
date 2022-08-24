import { useState, useEffect } from "react";

export default function useFetch<T  = any >(url: string): [string] | [null, T] {
    const [data, setData] = useState<T>()
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        getitems()
    }, [])

    async function getitems() {
        const response = await fetch(url)
        const data = await response.json();
        if (data.error) return setError(data.error)
        return setData(data)
    }
    if (error) return [error]
    else return [null, data!]
}