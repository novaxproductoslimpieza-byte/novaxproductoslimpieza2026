"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  ShoppingBag,
  Languages,
  Monitor,
  ChevronRight
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
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

interface UserData {
  nombre: string
  correo?: string
  avatar?: string
  rol?: string
}

interface AvatarDropdownProps {
  user: UserData | null
  logout: () => void
}

export function AvatarDropdown({ user, logout }: AvatarDropdownProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [openConfig, setOpenConfig] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => {
            if (!user) router.push("/login")
            else setOpen(prev => !prev)
          }}
        >
          <div
            className={`rounded-circle h-6 w-6 flex items-center justify-center border border-black ${user ? "bg-white shadow-sm overflow-hidden" : "bg-muted"
              }`}
          >
            {user ? (
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={user.avatar || ""}
                  alt={user.nombre || "Usuario"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-black text-white flex items-center justify-center">
                  {user.nombre.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <User className="h-4 w-4 text-white" />
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>

      {user && (
        <DropdownMenuContent
          className="w-40 z-1200 bg-white shadow-lg rounded-md"
          align="end"
          forceMount
        >
          {/* Info usuario */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.nombre}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.correo}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Opciones de usuario */}
          <DropdownMenuItem
            onClick={() => {
              router.push("/profile")
              setOpen(false)
            }}
            className="cursor-pointer w-full flex items-center"
          >
            <User className="mr-2 h-4 w-4 text-primary" />
            <span>Tu perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push("/orders")
              setOpen(false)
            }}
            className="cursor-pointer w-full flex items-center"
          >
            <ShoppingBag className="mr-2 h-4 w-4 text-primary" />
            <span>Tus pedidos</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {user.rol === "ADMINISTRADOR" && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  router.push("/admin/orders")
                  setOpen(false)
                }}
                className="cursor-pointer w-full flex items-center font-bold text-primary"
              >
                <Settings className="mr-2 h-4 w-4 text-primary" />
                <span>Administrador</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}



          {/* Configuración */}

          <DropdownMenuItem
            className="flex justify-between items-center cursor-pointer relative"
            onMouseEnter={() => setOpenConfig(true)}
            onMouseLeave={() => setOpenConfig(false)}
          >
            <span className="text-sm">Configuración</span>
            <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />

            {openConfig && (
              <div
                className="absolute top-0 left-full w-80 bg-white shadow-lg rounded-md p-3 z-80"
              >
                {/* Tema */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {theme === "dark" ? (
                      <Moon className="h-4 w-4 text-primary" />
                    ) : (
                      <Sun className="h-4 w-4 text-primary" />
                    )}
                    <span className="text-sm">Tema</span>
                  </div>
                  <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
                    <Button
                      variant={theme === "light" ? "default" : "ghost"}
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "ghost"}
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "ghost"}
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setTheme("system")}
                    >
                      <Monitor className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Idioma */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm">Idioma</span>
                  </div>
                  <Select defaultValue="es" disabled>
                    <SelectTrigger className="h-7 w-[90px] text-xs">
                      <SelectValue placeholder="Idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </DropdownMenuItem>



          {/* Logout */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
          >
            <LogOut className="text-red-500 mr-2 h-4 w-4" />
            <span className="text-red-500">Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}