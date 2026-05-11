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

    const [editingLessonId, setEditingLessonId] = useState(null);

    const [editTitle, setEditTitle] = useState("");

    const [editStatus, setEditStatus] = useState("");

    const [editVideoUrl, setEditVideoUrl] = useState("");

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
    async function handleDeleteLesson(id) {

        const confirmDelete = confirm(
            "Deseja deletar esta lesson?"
        );

        if (!confirmDelete) {

            return;
        }

        try {

            const token = localStorage.getItem("token");

            await api.delete(
                `/lessons/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            loadCourse();

        } catch (error) {

            console.log(error);

            alert("Erro ao deletar lesson");
        }
    }

    function handleStartLessonEdit(lesson) {

        setEditingLessonId(lesson.id);

        setEditTitle(lesson.title);

        setEditStatus(lesson.status);

        setEditVideoUrl(lesson.video_url);
    }

    async function handleSaveLessonEdit(id) {

        try {

            const token = localStorage.getItem("token");

            await api.put(
                `/lessons/${id}`,
                {
                    title: editTitle,
                    status: editStatus,
                    video_url: editVideoUrl
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEditingLessonId(null);

            loadCourse();

        } catch (error) {

            console.log(error);

            alert("Erro ao editar lesson");
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

                            {
                                editingLessonId === lesson.id && (

                                    <div className="mt-4 space-y-3">

                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(event) =>
                                                setEditTitle(event.target.value)
                                            }
                                            className="w-full border rounded-lg p-2"
                                        />

                                        <input
                                            type="text"
                                            value={editVideoUrl}
                                            onChange={(event) =>
                                                setEditVideoUrl(event.target.value)
                                            }
                                            className="w-full border rounded-lg p-2"
                                        />

                                        <select
                                            value={editStatus}
                                            onChange={(event) =>
                                                setEditStatus(event.target.value)
                                            }
                                            className="w-full border rounded-lg p-2"
                                        >

                                            <option value="draft">
                                                Draft
                                            </option>

                                            <option value="published">
                                                Published
                                            </option>

                                        </select>

                                        <button
                                            onClick={() =>
                                                handleSaveLessonEdit(lesson.id)
                                            }
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                        >
                                            Salvar
                                        </button>

                                    </div>
                                )
                            }

                            <div className="mt-4">

                                <button
                                    onClick={() =>
                                        handleDeleteLesson(lesson.id)
                                    }
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Deletar
                                </button>

                                <button
                                    onClick={() =>
                                        handleStartLessonEdit(lesson)
                                    }
                                    className="ml-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Editar
                                </button>

                            </div>

                        </div>
                    ))
                )
            }

        </div>
    );
}