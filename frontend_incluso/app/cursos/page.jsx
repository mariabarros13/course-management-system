import { getCourses } from "../../lib/courses";
import CourseCatalog from "../../components/courses/CourseCatalog";

export const metadata = {
    title: "Cursos — Incluso"
};

// Server Component: busca os dados no servidor. A parte interativa
// (filtros) fica isolada no CourseCatalog ("use client"), seguindo o
// padrão recomendado pelo App Router — só vira client o que precisa de
// estado/eventos no navegador.
export default async function CursosPage() {
    const courses = await getCourses();

    return (
        <main id="conteudo-principal" className="mx-auto max-w-5xl px-4 py-10">
            <h1 className="mb-6 text-2xl font-medium text-ink-800">Cursos</h1>
            <CourseCatalog courses={courses} />
        </main>
    );
}
