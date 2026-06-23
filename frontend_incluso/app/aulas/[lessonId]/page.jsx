import { getLessonById } from "../../../lib/courses";
import VideoPlayer from "../../../components/player/VideoPlayer";

export default async function AulaPage({ params }) {
    const lesson = await getLessonById(params.lessonId);

    return (
        <main id="conteudo-principal" className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-4 text-xl font-medium text-ink-800">{lesson.title}</h1>

            <VideoPlayer
                title={lesson.title}
                src={lesson.videoUrl}
                posterUrl={lesson.posterUrl}
                captionsUrl={lesson.subtitleUrl}
                subtitleStatus={lesson.subtitleStatus}
                librasVideoUrl={lesson.librasVideoUrl}
            />

            {/* Abas mencionadas no briefing (transcrição, materiais, dúvidas)
                ficam fora do escopo pedido nesta etapa — este componente é
                só o consumidor de exemplo do VideoPlayer. */}
        </main>
    );
}
