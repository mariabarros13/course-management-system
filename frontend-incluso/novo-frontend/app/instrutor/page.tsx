'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

const mockLessons = [
  {
    id: '1',
    title: 'Introdução à lógica de programação',
    description: 'Conceitos iniciais e variáveis.',
    status: 'published',
    views: 248,
    hasLibras: true,
    hasSubtitles: true,
    transcriptionStatus: 'completed',
  },
  {
    id: '2',
    title: 'Estruturas condicionais',
    description: 'If, else e switch na prática.',
    status: 'published',
    views: 187,
    hasAdaptedMaterials: true,
    transcriptionStatus: 'completed',
  },
  {
    id: '3',
    title: 'Laços de repetição',
    description: 'For, while e do-while.',
    status: 'draft',
    views: 0,
    transcriptionStatus: 'processing',
    progress: 62,
  },
  {
    id: '4',
    title: 'Funções e modularização',
    description: 'Quebrando código em pedaços.',
    status: 'draft',
    views: 0,
    transcriptionStatus: 'error',
    errorMessage: 'Falha no upload. Verifique o arquivo e tente novamente.',
  },
];

export default function InstrutorPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      // Redirect to login
      window.location.href = '/login';
    } else {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserName(userData.email?.split('@')[0] || 'Instrutor');
      } catch {}
    }
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white">
      <Header isLoggedIn={isLoggedIn} userName={userName} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <p className="text-cyan-600 font-semibold uppercase tracking-wide text-sm mb-2">Painel do instrutor</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Suas aulas</h1>
            <p className="text-gray-600">
              Gerencie uploads, transcrições por IA e solicitações de intérprete.
            </p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
            + Fazer upload de nova aula
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Aulas Publicadas</p>
            <p className="text-4xl font-bold text-gray-900 mb-1">2</p>
            <p className="text-xs text-blue-600 font-semibold">ATUALIZADO</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Em Transcrição</p>
            <p className="text-4xl font-bold text-gray-900 mb-1">1</p>
            <p className="text-xs text-yellow-600 font-semibold">ATUALIZADO</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Total de Visualizações</p>
            <p className="text-4xl font-bold text-gray-900 mb-1">435</p>
            <p className="text-xs text-cyan-600 font-semibold">ATUALIZADO</p>
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {mockLessons.map((lesson) => (
            <div key={lesson.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  {/* Status badges */}
                  <div className="flex gap-2 mb-3">
                    {lesson.status === 'published' && (
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                        📋 PUBLICADA
                      </span>
                    )}
                    {lesson.status === 'draft' && (
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                        📝 RASCUNHO
                      </span>
                    )}
                    {lesson.hasLibras && (
                      <span className="inline-block bg-cyan-100 text-cyan-700 text-xs font-semibold px-2 py-1 rounded">
                        👋 LIBRAS HUMANO
                      </span>
                    )}
                    {lesson.hasSubtitles && (
                      <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded">
                        ✓ AULA ACESSÍVEL
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">{lesson.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{lesson.description}</p>

                  {/* Transcription Status */}
                  {lesson.transcriptionStatus === 'processing' && (
                    <div className="mb-3">
                      <div className="text-xs text-yellow-600 font-semibold uppercase mb-1">
                        ⏳ Sendo transcrito pela IA...
                      </div>
                      <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${lesson.progress || 50}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {lesson.transcriptionStatus === 'error' && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">
                        ⚠️ {lesson.errorMessage}
                      </p>
                    </div>
                  )}

                  {lesson.views > 0 && (
                    <p className="text-xs text-gray-500">
                      👁️ {lesson.views} visualizações
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button className="bg-cyan-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-cyan-700 transition text-sm whitespace-nowrap flex items-center gap-2">
                    👋 Solicitar tradutor
                  </button>
                  <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition text-sm whitespace-nowrap flex items-center gap-2">
                    ✨ Gerar legenda IA
                  </button>
                  <button className="border-2 border-red-200 text-red-600 px-4 py-2 rounded-full font-semibold hover:bg-red-50 transition text-sm whitespace-nowrap">
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
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
