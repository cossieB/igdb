interface Props {
    html: string,
    className: string
}

export default function Description({html, className}: Props) {
    return (
        <div className={className} dangerouslySetInnerHTML={{__html: html}} />
    )
}