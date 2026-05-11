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

            // salva token
            localStorage.setItem(
                "token",
                response.data.token
            );

            alert("Login realizado");

            window.location.href = "/dashboard";

            console.log(response.data);

        } catch (error) {

            console.log(error);

            alert("Erro no login");
        }
    }

    return (
        <div>

            <h1>Login</h1>

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                />

                <br />
                <br />

                <button type="submit">
                    Entrar
                </button>

            </form>

        </div>
    );
}