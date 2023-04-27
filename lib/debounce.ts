export default function debounce<T>(cb: (...input: T[]) => void, delay = 500) {
    let timeout: NodeJS.Timeout
    return function(...args: T[]) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}