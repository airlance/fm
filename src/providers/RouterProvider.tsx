import { useNavigate } from 'react-router-dom';

let navigate: (path: string) => void;

const setNavigate = (navFn: (path: string) => void) => {
    navigate = navFn;
};

export const globalNavigate = (path: string) => {
    if (navigate) navigate(path);
};

export default function RouterProvider({ children } : { children: React.ReactNode }) {
    const navigate = useNavigate();
    setNavigate(navigate);
    return children;
}