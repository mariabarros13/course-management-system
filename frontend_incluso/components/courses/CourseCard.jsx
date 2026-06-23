import Link from "next/link";
import AccessibilityBadge from "../ui/AccessibilityBadge";

export default function CourseCard({ course }) {
    const { id, title, category, progress, hasAiCaptions, hasLibrasHuman } = course;

    return (
        <Link
            href={`/cursos/${id}`}
            className="group flex flex-col gap-3 rounded-xl border border-ink-200 bg-white p-4
                       transition hover:border-primary-600 hover:shadow-sm"
        >
            <div
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-700"
                aria-hidden="true"
            >
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M4 4h16v12H4zM2 20h20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            </div>

            <div>
                <p className="text-xs text-ink-600">{category}</p>
                <h3 className="font-medium text-ink-800 group-hover:text-primary-700">{title}</h3>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {hasAiCaptions && <AccessibilityBadge variant="ai" />}
                {hasLibrasHuman && <AccessibilityBadge variant="libras" />}
            </div>

            <div className="mt-auto flex items-center gap-2">
                {/* <progress> nativo já expõe valor/máximo para leitores de tela
                    sem precisar recriar role="progressbar" manualmente. */}
                <progress
                    value={progress}
                    max={100}
                    aria-label={`Progresso no curso ${title}: ${progress}%`}
                    className="h-2 w-full overflow-hidden rounded-full
                               [&::-webkit-progress-bar]:bg-ink-100
                               [&::-webkit-progress-value]:bg-primary-600
                               [&::-moz-progress-bar]:bg-primary-600"
                />
                <span className="text-xs font-medium text-ink-600" aria-hidden="true">
                    {progress}%
                </span>
            </div>
        </Link>
    );
}
