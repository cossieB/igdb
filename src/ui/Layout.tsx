import { html } from "hono/html";
import type { FC, JSX, JSXNode } from "hono/jsx";

export const Layout: FC = (props) => {
    return html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="google.css" />
        <title>IGDB</title>
    </head>
    <body>
        <main>
            ${props.children}
        </main>

        <script src="script.js"></script>
    </body>
    </html>
    
    `
}