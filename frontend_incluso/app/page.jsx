import Link from "next/link";

// Página inicial fora do escopo detalhado deste pedido (arquitetura de
// pastas, VideoPlayer e listagem de cursos) — mantida mínima só para o
// projeto ter uma rota "/" válida.
export default function HomePage() {
    return (
        <main id="conteudo-principal" className="mx-auto max-w-3xl px-4 py-16 text-center">
            <h1 className="text-3xl font-medium text-ink-800">
                Aprender sem barreiras, evoluir sem limites.
            </h1>
            <Link
                href="/cursos"
                className="mt-6 inline-block rounded-lg bg-primary-600 px-5 py-2.5 font-medium text-white hover:bg-primary-700"
            >
                Explorar cursos
            </Link>
        </main>
    );
}
