"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  ShoppingBag,
  Languages,
  Monitor
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Switch } from "@/components/ui/Switch"

interface UserData {
  nombre: string
  correo?: string
  avatar?: string
}

interface AvatarDropdownProps {
  user: UserData | null
  logout: () => void
}

export function AvatarDropdown({ user, logout }: AvatarDropdownProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
      </Button>
    )
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0">
          <div className="rounded-circle bg-white shadow-sm overflow-hidden h-6 w-6 flex items-center justify-center border border-black">
            <Avatar className="h-full w-full">
              <AvatarImage
                src={user?.avatar || "https://github.com/shadcn.png"}
                alt={user?.nombre || "Usuario"}
                className="object-cover"
              />
              <AvatarFallback className="bg-black text-white flex items-center justify-center">
                {user?.nombre ? user.nombre.substring(0, 2).toUpperCase() : <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end" forceMount>
        {user ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.nombre}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.correo}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        ) : (
          <>
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium leading-none italic">Invitado</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer w-full flex items-center">
              <User className="mr-2 h-4 w-4 text-primary" />
              <span>Tu perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/orders" className="cursor-pointer w-full flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4 text-primary" />
              <span>Tu cuenta / Pedidos</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs font-semibold uppercase text-muted-foreground px-2 py-1.5">
          Configuración
        </DropdownMenuLabel>

        <div className="px-2 py-1.5">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              {theme === 'dark' ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
              <span className="text-sm">Tema</span>
            </div>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
              <Button
                variant={theme === 'light' ? 'default' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setTheme('light')}
                title="Luz"
              >
                <Sun className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setTheme('dark')}
                title="Oscuro"
              >
                <Moon className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setTheme('system')}
                title="Sistema"
              >
                <Monitor className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="px-2 py-1.5">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <Languages className="h-4 w-4 text-primary" />
              <span className="text-sm">Idioma</span>
            </div>
            <Select defaultValue="es">
              <SelectTrigger className="h-8 w-[100px] text-xs">
                <SelectValue placeholder="Idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
