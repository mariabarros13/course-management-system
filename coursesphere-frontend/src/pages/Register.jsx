import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister(event) {

        event.preventDefault();

        setLoading(true);

        try {

            await api.post("/auth/register", {
                name,
                email,
                password
            });

            alert("Usuário criado com sucesso!");

            window.location.href = "/";

        } catch (error) {

            console.log(error);

            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert("Erro ao criar usuário");
            }

        } finally {
            setLoading(false);
        }
    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-10 rounded-2xl shadow w-full max-w-md">

                <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">
                    Criar Conta
                </h1>

                <p className="text-gray-500 text-center mb-8">
                    Cadastre-se no CourseSphere
                </p>

                <form
                    onSubmit={handleRegister}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
                    >
                        {loading ? "Criando conta..." : "Cadastrar"}
                    </button>

                </form>

                <p className="text-center mt-6 text-gray-600">
                    Já possui conta?

                    <Link
                        to="/"
                        className="text-blue-600 font-semibold ml-1"
                    >
                        Entrar
                    </Link>
                </p>

            </div>

        </div>
    );
}