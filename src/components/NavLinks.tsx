"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavLinks() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/library", label: "Biblioteca" },
    { href: "/search", label: "Buscar" },
  ]

  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer
              ${isActive
                ? "text-foreground bg-gradient-to-r from-primary/70 to-secondary/70 shadow-pastel"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30 hover:scale-105"
              }
            `}
          >
            {link.label}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
            )}
          </Link>
        )
      })}
    </>
  )
}
