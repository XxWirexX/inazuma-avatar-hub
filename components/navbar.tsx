'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { User, LogOut, Upload, Home, Grid } from 'lucide-react'

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-lg hidden sm:inline">Inazuma Avatar Hub</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/gallery">
              <Button variant="ghost" size="sm" className="gap-2">
                <Grid className="h-4 w-4" />
                Galerie
              </Button>
            </Link>

            {session && (
              <Link href="/upload">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === 'loading' ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
          ) : session ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{session.user.name || session.user.email}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </>
          ) : (
            <Button onClick={() => signIn()} size="sm">
              Connexion
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-200 px-4 py-2 flex gap-2">
        <Link href="/gallery" className="flex-1">
          <Button variant="ghost" size="sm" className="w-full gap-2">
            <Grid className="h-4 w-4" />
            Galerie
          </Button>
        </Link>

        {session && (
          <Link href="/upload" className="flex-1">
            <Button variant="ghost" size="sm" className="w-full gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}
