import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import CourseDetails from "./pages/CourseDetails";

import PrivateRoute from "./routes/PrivateRoute";

import Register from "./pages/Register";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>}
                />

                <Route
                    path="/courses/:id"
                    element={<PrivateRoute>
                                <CourseDetails />
                            </PrivateRoute>}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;