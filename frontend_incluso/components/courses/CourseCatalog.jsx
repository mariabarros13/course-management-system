"use client";

import { useMemo, useState } from "react";
import CourseFilters from "./CourseFilters";
import CourseCard from "./CourseCard";

function matchesAccessibilityFilter(course, filter) {
    if (filter === "all") return true;
    if (filter === "ai_captions") return course.hasAiCaptions;
    if (filter === "libras_human") return course.hasLibrasHuman;
    return true;
}

/**
 * Recebe os cursos já carregados pelo Server Component (app/cursos/page.jsx)
 * e faz a filtragem no cliente — não há nova chamada de rede a cada troca
 * de filtro, então o feedback é instantâneo.
 */
export default function CourseCatalog({ courses }) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [accessibilityFilter, setAccessibilityFilter] = useState("all");

    const categories = useMemo(
        () => [...new Set(courses.map((course) => course.category))],
        [courses]
    );

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const categoryMatches = selectedCategory === "all" || course.category === selectedCategory;
            return categoryMatches && matchesAccessibilityFilter(course, accessibilityFilter);
        });
    }, [courses, selectedCategory, accessibilityFilter]);

    return (
        <div className="flex flex-col gap-6">
            <CourseFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                accessibilityFilter={accessibilityFilter}
                onAccessibilityFilterChange={setAccessibilityFilter}
            />

            {/* Região viva: quem usa leitor de tela ouve a contagem mudar sem
                precisar navegar a página de novo procurando o resultado. */}
            <p className="text-sm text-ink-600" role="status" aria-live="polite">
                {filteredCourses.length} {filteredCourses.length === 1 ? "curso encontrado" : "cursos encontrados"}
            </p>

            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            ) : (
                <p className="rounded-lg border border-dashed border-ink-200 p-6 text-center text-ink-600">
                    Nenhum curso encontrado com esses filtros. Tente outra combinação.
                </p>
            )}
        </div>
    );
}
