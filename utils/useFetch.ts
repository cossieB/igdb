import { useState, useEffect } from "react";

export default function useFetch<T = any>(url: string, rand: number) {
    const [items, setItems] = useState<T[]>([])
    useEffect(() => {
        getitems()
    }, [rand])

    async function getitems() {
        const response = await fetch(url)
        const data = await response.json();
        if (data.items) return setItems(data.items)
    }
    return items
}