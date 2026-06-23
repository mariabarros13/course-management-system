// Em produção isto chama o backend real, ex:
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`);
//   return res.json();
//
// Os campos hasAiCaptions/hasLibrasHuman virão derivados de
// lessons.subtitle_status e do status do pedido de tradutor de LIBRAS,
// agregados por curso pelo backend.
export async function getCourses() {
    return [
        {
            id: "1",
            title: "Introdução à Programação",
            category: "Tecnologia",
            progress: 65,
            hasAiCaptions: true,
            hasLibrasHuman: true
        },
        {
            id: "2",
            title: "Comunicação Inclusiva",
            category: "Acessibilidade",
            progress: 40,
            hasAiCaptions: true,
            hasLibrasHuman: false
        },
        {
            id: "3",
            title: "Design Acessível",
            category: "Design",
            progress: 80,
            hasAiCaptions: true,
            hasLibrasHuman: true
        },
        {
            id: "4",
            title: "Fundamentos de UX",
            category: "Design",
            progress: 10,
            hasAiCaptions: false,
            hasLibrasHuman: false
        }
    ];
}

export async function getLessonById(lessonId) {
    return {
        id: lessonId,
        title: "Variáveis e tipos de dados",
        videoUrl: "https://example.com/video.mp4",
        posterUrl: null,
        subtitleUrl: "https://example.com/legendas/lesson-1.vtt",
        subtitleStatus: "completed", // none | processing | completed | failed
        librasVideoUrl: null
    };
}
