"use client"
import Search from "./Search";
import NavItem from "./NavItem";
import { DevSvg, GamesSvg, HomeSvg, PubSvg } from "../../utils/svgs";
import { useRef, useState } from "react";

export default function Nav() {
    const ref = useRef<HTMLElement>(null);
    const [isFocused, setIsFocused] = useState(false)
    
    return (
        <nav className={`${isFocused ? "navbar_active" : ""}`} ref={ref}>
            <div className="logo" >
                <span className="logo1" style={{ color: 'var(--neongreen)' }} >I</span> <span style={{ color: 'var(--neonblue)' }} >G</span> <span style={{ color: 'var(--neonpink)' }} >D</span><span style={{ color: 'white' }} >B</span>
            </div>
            <NavItem label="Home" icon={<HomeSvg />} href="/" />
            <NavItem label="Games" icon={<GamesSvg />} href="/games" />
            <NavItem label="Developers" icon={<DevSvg />} href="/developers" />
            <NavItem label="Publishers" icon={<PubSvg />} href="/publishers" />
            <Search
                navbar={ref!}
                isFocused={isFocused}
                setIsFocused={setIsFocused} />
        </nav>
    )
}