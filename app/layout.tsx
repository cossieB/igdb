import { Metadata } from "next"
import '../styles/globals.scss'
import Nav from "../components/Nav/Nav"

export const metadata: Metadata = {
    title: {
        default: "IGDB",
        template: "%s :: IGDB"
    },
    description: 'Gaming database developed by full-stack developer Buntu Cossie using Next.js 13, SASS and GraphQL',
    authors: [{
        name: "Buntu Cossie",
        url: "https://cossie-91.web.app",
    }],
    applicationName: "Internet Games Database",
    creator: "Buntu Cossie",
    robots: {
        follow: true,
        index: true,
        googleBot: {
            follow: true,
            index: true
        }
    },
    colorScheme: "dark",
    keywords: ["next.js", "react", "project"],
    openGraph: {
        title: "Internet Games Database",
        authors: new URL("https://cossie-91.web.app"),
        description: "Gaming database developed by full-stack developer Buntu Cossie using Next.js 13, SASS and GraphQL",
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;700&family=Press+Start+2P&display=swap" rel="stylesheet" />
            </head>
            <body>
                <Nav />
                <main>
                    {children}
                </main>
            </body>
        </html>
    )
}
