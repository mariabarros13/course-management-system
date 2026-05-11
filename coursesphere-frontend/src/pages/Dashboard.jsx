import {
    useEffect,
    useState
} from "react";

import { Link } from "react-router-dom";

import api from "../services/api";

export default function Dashboard() {

    const [courses, setCourses] = useState([]);

    const [name, setName] = useState("");

    const [description, setDescription] = useState("");

    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");

    const [editingCourseId, setEditingCourseId] = useState(null);

    const [editName, setEditName] = useState("");

    const [editDescription, setEditDescription] = useState("");

    const [editStartDate, setEditStartDate] = useState("");

    const [editEndDate, setEditEndDate] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    const [search, setSearch] = useState("");

    async function loadCourses() {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/courses",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCourses(response.data);

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message || "Erro"
            );
        }
    }

    async function handleCreateCourse(event) {

        event.preventDefault();

        try {

            const token = localStorage.getItem("token");

            await api.post(
                "/courses",
                {
                    name,
                    description,
                    start_date: startDate,
                    end_date: endDate
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setName("");
            setDescription("");
            setStartDate("");
            setEndDate("");

            loadCourses();

        } catch (error) {

            console.log(error);
        }
    }

    async function handleDeleteCourse(id) {

        const confirmDelete = confirm(
            "Deseja deletar este curso?"
        );

        if (!confirmDelete) {

            return;
        }

        try {

            const token = localStorage.getItem("token");

            await api.delete(
                `/courses/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            loadCourses();

        } catch (error) {

            console.log(error);

            alert("Erro ao deletar curso");
        }
    }

    function handleStartEdit(course) {

        setEditingCourseId(course.id);

        setEditName(course.name);

        setEditDescription(course.description);

        setEditStartDate(course.start_date);

        setEditEndDate(course.end_date);
    }

    async function handleSaveEdit(id) {

        try {

            const token = localStorage.getItem("token");

            await api.put(
                `/courses/${id}`,
                {
                    name: editName,
                    description: editDescription,
                    start_date: editStartDate,
                    end_date: editEndDate
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEditingCourseId(null);

            loadCourses();

        } catch (error) {

            console.log(error);

            alert("Erro ao editar curso");
        }
    }

    function handleLogout() {

        localStorage.removeItem("token");

        window.location.href = "/";
    }

    useEffect(() => {

        loadCourses();

    }, []);

    const filteredCourses = courses.filter((course) =>
        course.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (

        <div className="min-h-screen bg-gray-100">

            {/* NAVBAR */}
            <header className="bg-white shadow">

                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

                    <h1 className="text-2xl font-bold text-blue-600">
                        CourseSphere
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button>

                </div>

            </header>

            <main className="max-w-6xl mx-auto p-6">

                {/* FORM */}
                <div className="bg-white rounded-2xl shadow p-6 mb-8">

                    <h2 className="text-2xl font-bold mb-6">
                        Novo Curso
                    </h2>

                    <form
                        onSubmit={handleCreateCourse}
                        className="space-y-4"
                    >

                        <input
                            type="text"
                            placeholder="Nome do curso"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            className="w-full border rounded-lg p-3"
                        />

                        <textarea
                            placeholder="Descrição"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            className="w-full border rounded-lg p-3"
                        />

                        <div className="grid grid-cols-2 gap-4">

                            <input
                                type="date"
                                value={startDate}
                                onChange={(event) =>
                                    setStartDate(event.target.value)
                                }
                                className="border rounded-lg p-3"
                            />

                            <input
                                type="date"
                                value={endDate}
                                onChange={(event) =>
                                    setEndDate(event.target.value)
                                }
                                className="border rounded-lg p-3"
                            />

                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Criar Curso
                        </button>

                    </form>

                </div>

                {/* COURSES */}
                <div>

                    <h2 className="text-3xl font-bold mb-6">
                        Cursos
                    </h2>

                    <input
                        type="text"
                        placeholder="Buscar curso..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        className="w-full border rounded-lg p-3 mb-6"
                    />

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {
                            filteredCourses.length === 0 && (

                                <p className="text-gray-500">
                                    Nenhum curso encontrado
                                </p>
                            )
                        }
                        
                        {
                            filteredCourses.map((course) => {

                                const isOwner = Number(course.creator_id) === Number(user.id);

                                return (

                                <div
                                    key={course.id}
                                    className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
                                >

                                    <h3 className="text-xl font-bold mb-2">
                                        {course.name}
                                    </h3>

                                    <p className="text-gray-600 mb-4">
                                        {course.description}
                                    </p>

                                    <p className="text-sm text-gray-500 mb-4">
                                        {course.start_date}
                                        {" - "}
                                        {course.end_date}
                                    </p>

                                    {
                                        editingCourseId === course.id && (

                                            <div className="mt-4 space-y-3">

                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(event) =>
                                                        setEditName(event.target.value)
                                                    }
                                                    className="w-full border rounded-lg p-2"
                                                />

                                                <textarea
                                                    value={editDescription}
                                                    onChange={(event) =>
                                                        setEditDescription(event.target.value)
                                                    }
                                                    className="w-full border rounded-lg p-2"
                                                />

                                                <div className="grid grid-cols-2 gap-2">

                                                    <input
                                                        type="date"
                                                        value={editStartDate}
                                                        onChange={(event) =>
                                                            setEditStartDate(event.target.value)
                                                        }
                                                        className="border rounded-lg p-2"
                                                    />

                                                    <input
                                                        type="date"
                                                        value={editEndDate}
                                                        onChange={(event) =>
                                                            setEditEndDate(event.target.value)
                                                        }
                                                        className="border rounded-lg p-2"
                                                    />

                                                </div>

                                                <button
                                                    onClick={() =>
                                                        handleSaveEdit(course.id)
                                                    }
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Salvar
                                                </button>

                                            </div>
                                        )
                                    }

                                    <Link
                                        to={`/courses/${course.id}`}
                                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Ver Curso
                                    </Link>

                                    <button
                                        onClick={() =>
                                            handleDeleteCourse(course.id)
                                        }
                                        disabled={!isOwner}

                                        title={
                                            isOwner
                                            ? ""
                                            : "Apenas o criador pode deletar"
                                        }

                                        className={
                                            isOwner
                                            ? "ml-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                            : "ml-3 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
                                        }
                                    >
                                        Deletar
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleStartEdit(course)
                                        }
                                        disabled={!isOwner}

                                        title={
                                            isOwner
                                            ? ""
                                            : "Apenas o criador pode editar"
                                        }

                                        className={
                                            isOwner
                                            ? "ml-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                                            : "ml-3 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
                                        }
                                    >
                                        Editar
                                    </button>

                                </div>
                            );
                        })
                    }

                    </div>

                </div>

            </main>

        </div>
    );
}