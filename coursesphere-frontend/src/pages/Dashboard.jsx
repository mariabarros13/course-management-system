import { useEffect, useState } from "react";

import api from "../services/api";

import { Link } from "react-router-dom";

export default function Dashboard() {

    const [courses, setCourses] = useState([]);

    const [name, setName] = useState("");

    const [description, setDescription] = useState("");

    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");

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

            alert("Erro ao buscar cursos");
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

            alert("Curso criado");

            // limpa formulário
            setName("");
            setDescription("");
            setStartDate("");
            setEndDate("");

            // atualiza lista
            loadCourses();

        } catch (error) {

            console.log(error);

            alert("Erro ao criar curso");
        }
    }

    useEffect(() => {

        loadCourses();

    }, []);

    return (
        <div style={{ padding: "20px" }}>

            <h1>Dashboard</h1>

            <h2>Novo Curso</h2>

            <form onSubmit={handleCreateCourse}>

                <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                />

                <br />
                <br />

                <textarea
                    placeholder="Descrição"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                />

                <br />
                <br />

                <input
                    type="date"
                    value={startDate}
                    onChange={(event) =>
                        setStartDate(event.target.value)
                    }
                />

                <br />
                <br />

                <input
                    type="date"
                    value={endDate}
                    onChange={(event) =>
                        setEndDate(event.target.value)
                    }
                />

                <br />
                <br />

                <button type="submit">
                    Criar Curso
                </button>

            </form>

            <hr />

            <h2>Cursos</h2>

            {
                courses.map((course) => (

                    <div
                        key={course.id}
                        style={{
                            border: "1px solid black",
                            marginBottom: "10px",
                            padding: "10px"
                        }}
                    >

                        <h3>{course.name}</h3>

                        <p>
                            {course.description}
                        </p>

                        <p>
                            Criado por:
                            {" "}
                            {course.creator_name}
                        </p>

                        <Link to={`/courses/${course.id}`}>
                            Ver Curso
                        </Link>

                        <p>
                            {course.start_date}
                            {" - "}
                            {course.end_date}
                        </p>

                    </div>
                ))
            }

        </div>
    );
}