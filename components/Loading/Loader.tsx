import { Spinner } from "./Spinner"

type P = {
    children: JSX.Element,
    loading: boolean,
    placeholder?: JSX.Element
}

export default function Loader({children, loading, placeholder}: P) {
    if (loading) {
        return placeholder ?? <Spinner />
    }
    return children
}