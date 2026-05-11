import {
    useEffect,
    useState
} from "react";

import { useParams } from "react-router-dom";

import api from "../services/api";

export default function CourseDetails() {

    const { id } = useParams();

    const [course, setCourse] = useState(null);

    const [lessons, setLessons] = useState([]);

    const [title, setTitle] = useState("");

    const [status, setStatus] = useState("draft");

    const [videoUrl, setVideoUrl] = useState("");

    async function loadCourse() {

        try {

            const token = localStorage.getItem("token");

            // busca curso
            const courseResponse = await api.get(
                `/courses/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCourse(courseResponse.data);

            // busca lessons
            const lessonsResponse = await api.get(
                `/courses/${id}/lessons`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setLessons(lessonsResponse.data);

        } catch (error) {

            console.log(error);

            alert("Erro ao carregar curso");
        }
    }

    async function handleCreateLesson(event) {

        event.preventDefault();

        try {

            const token = localStorage.getItem("token");

            await api.post(
                "/lessons",
                {
                    title,
                    status,
                    video_url: videoUrl,
                    course_id: id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Lesson criada");

            // limpa formulário
            setTitle("");
            setStatus("draft");
            setVideoUrl("");

            // atualiza lista
            loadCourse();

        } catch (error) {

            console.log(error);

            alert("Erro ao criar lesson");
        }
    }

    useEffect(() => {

        loadCourse();

    }, []);

    if (!course) {

        return <h1>Carregando...</h1>;
    }

    return (

        <div style={{ padding: "20px" }}>

            <h1>{course.name}</h1>

            <p>
                {course.description}
            </p>

            <p>
                Criado por:
                {" "}
                {course.creator_name}
            </p>

            <h2>Nova Lesson</h2>

            <form onSubmit={handleCreateLesson}>

                <input
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                />

                <br />
                <br />

                <input
                    type="text"
                    placeholder="URL do vídeo"
                    value={videoUrl}
                    onChange={(event) =>
                        setVideoUrl(event.target.value)
                    }
                />

                <br />
                <br />

                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value)
                    }
                >

                    <option value="draft">
                        Draft
                    </option>

                    <option value="published">
                        Published
                    </option>

                </select>

                <br />
                <br />

                <button type="submit">
                    Criar Lesson
                </button>

            </form>

            <hr />

            <h2>Lessons</h2>

            {
                lessons.length === 0
                ? (
                    <p>
                        Nenhuma lesson cadastrada
                    </p>
                )
                : (
                    lessons.map((lesson) => (

                        <div
                            key={lesson.id}
                            style={{
                                border: "1px solid gray",
                                marginBottom: "10px",
                                padding: "10px"
                            }}
                        >

                            <h3>
                                {lesson.title}
                            </h3>

                            <p>
                                Status:
                                {" "}
                                {lesson.status}
                            </p>

                            <a
                                href={lesson.video_url}
                                target="_blank"
                            >
                                Ver vídeo
                            </a>

                        </div>
                    ))
                )
            }

        </div>
    );
}