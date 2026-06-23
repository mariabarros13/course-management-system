const VARIANTS = {
    // Light tint + texto -700/-800: sempre passa AA (texto escuro em fundo claro).
    ai: "bg-primary-50 text-primary-700",
    libras: "bg-secondary-50 text-secondary-700",
    success: "bg-secondary-700 text-white",
    pending: "bg-ink-100 text-ink-700",
    error: "bg-red-50 text-red-700"
};

const LABELS = {
    ai: "Legenda por IA",
    libras: "Intérprete de LIBRAS",
    success: "Aula acessível",
    pending: "Gerando legenda...",
    error: "Legenda indisponível"
};

/**
 * variant: 'ai' | 'libras' | 'success' | 'pending' | 'error'
 * Sempre combina cor de fundo clara com texto escuro (ou fundo -700 com
 * texto branco no caso de 'success') — nunca usa secondary-500/accent-500
 * puros com texto branco, que falham o contraste mínimo de 4.5:1.
 */
export default function AccessibilityBadge({ variant = "ai", children }) {
    const classes = VARIANTS[variant] ?? VARIANTS.ai;
    const label = children ?? LABELS[variant] ?? LABELS.ai;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}
        >
            {label}
        </span>
    );
}
