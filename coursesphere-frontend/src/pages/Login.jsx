import { useState } from "react";

import api from "../services/api";

export default function Login() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    async function handleLogin(event) {

        event.preventDefault();

        try {

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            window.location.href = "/dashboard";

        } catch (error) {

            console.log(error);

            alert("Erro no login");
        }
    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-10 rounded-2xl shadow w-full max-w-md">

                <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
                    CourseSphere
                </h1>

                <form
                    onSubmit={handleLogin}
                    className="space-y-4"
                >

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
                    >
                        Entrar
                    </button>

                </form>

            </div>

        </div>
    );
}