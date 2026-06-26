'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CourseCard from '@/components/CourseCard';

const allCourses = [
  {
    id: '1',
    title: 'Introdução à Programação',
    description: 'Aprenda lógica, variáveis e estruturas de controle do zero.',
    category: 'Tecnologia',
    icon: '</>',
    progress: 65,
    hasLibras: true,
    hasSubtitles: true,
  },
  {
    id: '2',
    title: 'Comunicação Inclusiva',
    description: 'Princípios de linguagem acessível e práticas inclusivas.',
    category: 'Comunicação',
    icon: '💬',
    progress: 40,
    hasLibras: true,
  },
  {
    id: '3',
    title: 'Design Acessível',
    description: 'Crie interfaces para todas as pessoas.',
    category: 'Design',
    icon: '🎨',
    progress: 80,
    hasSubtitles: true,
  },
  {
    id: '4',
    title: 'Desenvolvimento Pessoal',
    description: 'Encontre seu potencial e evolua constantemente.',
    category: 'Desenvolvimento Pessoal',
    icon: '🌱',
    hasLibras: true,
    hasAdaptedMaterials: true,
  },
  {
    id: '5',
    title: 'Introdução à Arte',
    description: 'Explore técnicas fundamentais de desenho e pintura.',
    category: 'Arte',
    icon: '🎭',
    hasSubtitles: true,
  },
  {
    id: '6',
    title: 'Musicoterapia',
    description: 'A música como instrumento de terapia e bem-estar.',
    category: 'Música',
    icon: '🎵',
    hasLibras: true,
  },
];

const categories = ['Todas', 'Tecnologia', 'Comunicação', 'Design', 'Desenvolvimento Pessoal', 'Arte', 'Música'];
const accessibilityTypes = ['Todos', 'Legenda IA', 'Intérprete de LIBRAS', 'LIBRAS + Legenda'];

export default function CursosPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Aluno');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedAccessibility, setSelectedAccessibility] = useState('Todos');
  const [filteredCourses, setFilteredCourses] = useState(allCourses);

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

  useEffect(() => {
    let filtered = allCourses;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'Todas') {
      filtered = filtered.filter((course) => course.category === selectedCategory);
    }

    // Accessibility filter
    if (selectedAccessibility !== 'Todos') {
      filtered = filtered.filter((course) => {
        if (selectedAccessibility === 'Legenda IA') return course.hasSubtitles;
        if (selectedAccessibility === 'Intérprete de LIBRAS') return course.hasLibras;
        if (selectedAccessibility === 'LIBRAS + Legenda') return course.hasLibras && course.hasSubtitles;
        return true;
      });
    }

    setFilteredCourses(filtered);
  }, [searchQuery, selectedCategory, selectedAccessibility]);

  return (
    <main className="min-h-screen bg-white">
      <Header isLoggedIn={isLoggedIn} userName={userName} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Catálogo de cursos</h1>
          <p className="text-gray-600">
            Encontre cursos adaptados às suas necessidades de acessibilidade.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar por título, tema ou instrutor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Categoria</h3>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Tipo de acessibilidade
            </h3>
            <div className="flex gap-2 flex-wrap">
              {accessibilityTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedAccessibility(type)}
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    selectedAccessibility === type
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} encontrado
            {filteredCourses.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum curso encontrado com esses filtros.</p>
          </div>
        )}
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
