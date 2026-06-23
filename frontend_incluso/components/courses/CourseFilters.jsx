"use client";

const ACCESSIBILITY_OPTIONS = [
    { value: "all", label: "Todos" },
    { value: "ai_captions", label: "Apenas com legenda IA" },
    { value: "libras_human", label: "Com intérprete de LIBRAS humano" }
];

/**
 * Componente controlado: quem guarda o estado é o pai (CourseCatalog).
 * Isso evita ter duas fontes de verdade para o mesmo filtro e deixa este
 * componente simples de testar isoladamente.
 */
export default function CourseFilters({
    categories,
    selectedCategory,
    onCategoryChange,
    accessibilityFilter,
    onAccessibilityFilterChange
}) {
    return (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1.5">
                <label htmlFor="filtro-categoria" className="text-sm font-medium text-ink-700">
                    Categoria
                </label>
                <select
                    id="filtro-categoria"
                    value={selectedCategory}
                    onChange={(event) => onCategoryChange(event.target.value)}
                    className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800
                               focus-visible:outline-none"
                >
                    <option value="all">Todas as categorias</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <fieldset className="flex flex-col gap-1.5">
                <legend className="text-sm font-medium text-ink-700">
                    Tipo de acessibilidade
                </legend>
                <div className="flex flex-wrap gap-3">
                    {ACCESSIBILITY_OPTIONS.map((option) => (
                        <label
                            key={option.value}
                            className="flex items-center gap-1.5 rounded-lg border border-ink-200
                                       bg-white px-3 py-2 text-sm text-ink-800 cursor-pointer
                                       has-[:checked]:border-primary-600 has-[:checked]:bg-primary-50"
                        >
                            <input
                                type="radio"
                                name="acessibilidade"
                                value={option.value}
                                checked={accessibilityFilter === option.value}
                                onChange={() => onAccessibilityFilterChange(option.value)}
                                className="accent-primary-600"
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            </fieldset>
        </div>
    );
}
