'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
  isLoggedIn?: boolean;
  userInitials?: string;
  userName?: string;
}

export default function Header({ isLoggedIn = false, userInitials = 'AM', userName = 'Aluno' }: HeaderProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              👋
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Incluso</h1>
              <p className="text-xs text-gray-500">Aprendizado para todos</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden sm:flex gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Início
            </Link>
            <Link href="/cursos" className="text-gray-700 hover:text-blue-600 font-medium">
              Cursos
            </Link>
            <Link href="/instrutor" className="text-gray-700 hover:text-blue-600 font-medium">
              Painel Instrutor
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">👤 {userName}</span>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 bg-blue-600 rounded-full text-white font-bold flex items-center justify-center hover:bg-blue-700 cursor-pointer"
                    aria-label="Menu do usuário"
                  >
                    {userInitials}
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <Link
                        href="/perfil"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                      >
                        Perfil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg border-t border-gray-200"
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="sm:hidden flex gap-4 pb-4 text-sm">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Início
          </Link>
          <Link href="/cursos" className="text-gray-700 hover:text-blue-600">
            Cursos
          </Link>
          <Link href="/instrutor" className="text-gray-700 hover:text-blue-600">
            Painel
          </Link>
        </nav>
      </div>
    </header>
  );
}
