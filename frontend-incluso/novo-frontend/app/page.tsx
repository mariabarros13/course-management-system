'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import CourseCard from '@/components/CourseCard';

const mockCourses = [
  {
    id: '1',
    title: 'Introdução à Programação',
    description: 'Aprenda lógica, variáveis e estruturas de controle do zero, com aulas 100% legendadas e janela de LIBRAS.',
    category: 'TECNOLOGIA',
    icon: '</>', // code icon
    progress: 65,
    hasLibras: true,
    hasSubtitles: true,
  },
  {
    id: '2',
    title: 'Comunicação Inclusiva',
    description: 'Princípios de linguagem acessível, escrita clara e práticas para conversar com pessoas surdas.',
    category: 'COMUNICAÇÃO',
    icon: '💬',
    progress: 40,
    hasLibras: true,
  },
  {
    id: '3',
    title: 'Design Acessível',
    description: 'Crie interfaces que funcionam para todas as pessoas, com foco em contraste, hierarquia e leitura.',
    category: 'DESIGN',
    icon: '🎨',
    progress: 80,
    hasSubtitles: true,
  },
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Aluno');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserName(userData.email?.split('@')[0] || 'Aluno');
      } catch {}
    }
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Header isLoggedIn={isLoggedIn} userName={userName} />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-block bg-yellow-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-semibold mb-4">
              ♿ ACESSIBILIDADE RADICAL
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Aprender sem <span className="text-blue-600">barreiras,</span> <br />
              <span className="text-blue-600">evoluir sem limites.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Cursos com legendas precisas, intérpretes de LIBRAS humanos e materiais pensados para a comunidade surda. Conhecimento que se comunica com você.
            </p>

            <div className="flex gap-4 mb-8">
              <Link
                href="/cursos"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Explorar cursos →
              </Link>
              <Link
                href="/instrutor"
                className="border-2 border-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:border-blue-600 transition"
              >
                Sou instrutor
              </Link>
            </div>

            {/* Feature badges */}
            <div className="flex gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👋</span>
                <span className="text-sm font-semibold text-gray-700">LIBRAS humano</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📝</span>
                <span className="text-sm font-semibold text-gray-700">Legenda por IA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">♿</span>
                <span className="text-sm font-semibold text-gray-700">Materiais adaptados</span>
              </div>
            </div>
          </div>

          {/* Right: Video player mockup */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative">
              <button className="absolute w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg z-10">
                ▶️
              </button>

              {/* Mockup LIBRAS window */}
              <div className="absolute top-4 right-4 bg-yellow-400 border-4 border-yellow-400 rounded-lg w-24 h-32 flex items-center justify-center text-xs font-bold text-center p-2">
                👋<br />LIBRAS
              </div>

              {/* Mockup subtitle */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3 text-sm">
                Bem-vindo! Vamos aprender juntos.
              </div>
            </div>

            {/* Video controls mockup */}
            <div className="mt-4 bg-gray-900 rounded-lg p-4 text-white text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>▶</span>
                <span>02:14 / 08:30</span>
              </div>
              <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded font-semibold text-xs">CC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Meus Cursos */}
      {isLoggedIn && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Meus cursos</h2>
              <p className="text-gray-600">Continue de onde parou.</p>
            </div>
            <Link href="/cursos" className="text-blue-600 hover:text-blue-700 font-semibold">
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </section>
      )}

      {/* Acessibilidade em primeiro lugar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl mt-12">
        <div className="flex items-start gap-6">
          <div className="text-5xl flex-shrink-0">👋</div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Acessibilidade em primeiro lugar</h2>
            <p className="text-gray-600 mb-4">
              Todos os nossos cursos possuem legendas, LIBRAS e materiais adaptados.
            </p>
            <Link
              href="/cursos"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Explorar →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <p>Incluso • Aprendizado para todos • {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  );
}
