'use client';

import Link from 'next/link';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  progress?: number;
  hasLibras?: boolean;
  hasSubtitles?: boolean;
  hasAdaptedMaterials?: boolean;
  viewCount?: number;
}

export default function CourseCard({
  id,
  title,
  description,
  category,
  icon,
  progress,
  hasLibras = false,
  hasSubtitles = false,
  hasAdaptedMaterials = false,
  viewCount = 0,
}: CourseCardProps) {
  return (
    <Link href={`/cursos/${id}`}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Header com ícone e badges */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="text-4xl">{icon}</div>
            <div className="flex gap-2 flex-wrap justify-end">
              {hasLibras && (
                <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 text-xs font-semibold px-2 py-1 rounded">
                  👋 LIBRAS
                </span>
              )}
              {hasSubtitles && (
                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded">
                  📝 LEGENDA
                </span>
              )}
              {hasAdaptedMaterials && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">
                  ♿ ACESSÍVEL
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">{category}</p>
        </div>

        {/* Conteúdo */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

          {/* Progress bar */}
          {progress !== undefined && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Progresso</span>
                <span className="text-xs font-bold text-gray-900">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          {viewCount > 0 && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              👁️ {viewCount} visualizações
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
