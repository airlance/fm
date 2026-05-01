import { Routes, Route, Navigate } from 'react-router-dom';
import { SetupPage } from "./pages/tactics/page";
import { Layout } from "./layout";

export default function MainModule() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Navigate to="tactics" replace />} />
                <Route path="tactics" element={<SetupPage />} />
            </Route>
        </Routes>
    )
}