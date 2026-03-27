"use client"

import React, { useState, useEffect, useRef } from "react"
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
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleOpen = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  };

  const handleClose = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => {
      setOpen(false);
      setOpenConfig(false);
    }, 180); // 🔹 delay de 200ms
  };


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
          className="p-0 hover:bg-transparent"
          onClick={() => {
            if (!user) router.push("/login")
            else handleOpen()
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!user) router.push("/login")
              else handleOpen()
            }
          }}
        >
          <div
            className={`rounded-full h-7 w-7 flex items-center justify-center border border-white/20 shadow-sm transition-transform active:scale-95 ${user ? "bg-white overflow-hidden" : "bg-muted"
              }`}
          >
            {user ? (
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={user.avatar || ""}
                  alt={user.nombre || "Usuario"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary-dark text-white flex items-center justify-center text-[10px] font-bold">
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
          className="w-52 z-1200 bg-white shadow-2xl rounded-xl border border-gray-100 p-0.5 mt-1 animate-in fade-in zoom-in-95"
          align="end"
          onMouseLeave={handleClose}   // 🔹 espera antes de cerrar
          onMouseEnter={handleOpen}    // 🔹 cancela cierre si vuelve a entrar
        >
          {/* Cabecera usuario */}
          <div className="px-3 py-3 mb-1 bg-gray-50/50 rounded-t-lg">
            <p className="text-sm font-bold text-gray-900">{user.nombre}</p>
            <p className="text-[11px] mt-1.5 text-muted-foreground font-medium">
              {user.correo}
            </p>
          </div>

          {/* Opciones */}
          <DropdownMenuItem
            onClick={() => { router.push("/profile"); setOpen(false) }}
            className="cursor-pointer flex items-center py-1.5 px-3 hover:bg-gray-50 rounded-md"
          >
            <User className="mr-2 h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Tu perfil</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => { router.push("/orders"); setOpen(false) }}
            className="cursor-pointer flex items-center py-1.5 px-3 hover:bg-gray-50 rounded-md"
          >
            <ShoppingBag className="mr-2 h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Tus pedidos</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 bg-gray-100" />

          {/* Configuración con submenú lateral */}
          <div className="relative">
            <DropdownMenuItem
              className={`flex justify-between items-center cursor-pointer py-1.5 px-3 rounded-md ${openConfig ? "bg-gray-50" : "hover:bg-gray-50"}`}
              onMouseEnter={() => setOpenConfig(true)}
            >
              <div className="flex items-center">
                <Settings className="mr-2 h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Configuración</span>
              </div>
              <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${openConfig ? "rotate-90 md:rotate-0" : ""}`} />
            </DropdownMenuItem>

            {openConfig && (
              <div
                className="absolute top-0 right-[calc(100%+8px)] w-64 bg-white shadow-2xl rounded-xl p-4 border border-gray-100 animate-in fade-in slide-in-from-right-2 z-50"
                onMouseLeave={() => setOpenConfig(false)}
                onMouseEnter={() => setOpenConfig(true)}
              >
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Preferencias</p>

                {/* Tema */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {theme === "dark" ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
                    <span className="text-xs font-bold text-gray-700">Modo Oscuro</span>
                  </div>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <Button variant={theme === "light" ? "secondary" : "ghost"} size="icon" onClick={() => setTheme("light")}>
                      <Sun className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant={theme === "dark" ? "secondary" : "ghost"} size="icon" onClick={() => setTheme("dark")}>
                      <Moon className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Idioma */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold text-gray-700">Idioma</span>
                  </div>
                  <Select defaultValue="es" disabled>
                    <SelectTrigger className="h-8 w-[95px] text-[11px] font-bold border-gray-200">
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
          </div>

          <DropdownMenuSeparator className="my-1 bg-gray-100" />

          {/* Logout */}
          <DropdownMenuItem
            onClick={handleLogout}
            className="mt-1 cursor-pointer flex items-center py-2 px-3 hover:bg-red-50 text-red-600 rounded-md"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="text-sm font-bold">Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}