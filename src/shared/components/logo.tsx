import logoUrl from "../../assets/cadc-logo.png"
import iconUrl from "../../assets/cadc-icon.png"
import { cn } from "./ui/cn"

type LogoProps = {
    className?: string
}

export function LogoMark({ className }: LogoProps) {
    return (
        <img
            src={iconUrl}
            alt=""
            className={cn("size-10 shrink-0", className)}
        />
    )
}

export function Logo({ className }: LogoProps) {
    return (
        <img
            src={logoUrl}
            alt="CADC"
            className={cn("h-12 w-auto", className)}
        />
    )
}
