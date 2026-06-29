"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Menu,
  LogOut,
  LayoutDashboard,
  User,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (
    <>
      <Link
        href="/"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Ana Sayfa
      </Link>
      {isAuthenticated && (
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Panel
        </Link>
      )}
    </>
  );

  const authButtons = isAuthenticated ? (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-2">
            <Avatar size="sm">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {user ? getInitials(user.firstName, user.lastName) : "?"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{user?.firstName}</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col gap-0.5">
              <span>
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <LayoutDashboard className="size-4" />
          Panelim
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <User className="size-4" />
          Profillerim
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={logout}>
          <LogOut className="size-4" />
          Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button variant="ghost" size="sm">
          Giriş Yap
        </Button>
      </Link>
      <Link href="/register">
        <Button size="sm">Kayıt Ol</Button>
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-xl supports-backdrop-filter:bg-background/50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="size-[18px]" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Portfolify
            </span>
            <Badge variant="secondary" className="hidden sm:inline-flex text-[10px]">
              Beta
            </Badge>
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {navLinks}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <div className="hidden sm:flex">{authButtons}</div>

          <div className="sm:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon-sm">
                    <Menu className="size-[18px]" />
                    <span className="sr-only">Menüyü aç</span>
                  </Button>
                }
              />
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Briefcase className="size-4" />
                    </div>
                    Portfolify
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4">
                  <SheetClose
                    render={
                      <Link
                        href="/"
                        className="rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                      />
                    }
                  >
                    Ana Sayfa
                  </SheetClose>
                  {isAuthenticated && (
                    <>
                      <SheetClose
                        render={
                          <Link
                            href="/dashboard"
                            className="rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                          />
                        }
                      >
                        Panel
                      </SheetClose>
                      <div className="my-2 border-t" />
                      <div className="flex items-center gap-3 px-3 py-2">
                        <Avatar size="sm">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {user
                              ? getInitials(user.firstName, user.lastName)
                              : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <SheetClose
                        render={
                          <Button
                            variant="outline"
                            className="mt-2 gap-2"
                            onClick={logout}
                          />
                        }
                      >
                        <LogOut className="size-4" />
                        Çıkış Yap
                      </SheetClose>
                    </>
                  )}
                  {!isAuthenticated && (
                    <>
                      <div className="my-2 border-t" />
                      <SheetClose
                        render={
                          <Link href="/login">
                            <Button
                              variant="outline"
                              className="w-full"
                            />
                          </Link>
                        }
                      >
                        Giriş Yap
                      </SheetClose>
                      <SheetClose
                        render={
                          <Link href="/register">
                            <Button className="w-full" />
                          </Link>
                        }
                      >
                        Kayıt Ol
                      </SheetClose>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
