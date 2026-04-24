import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            navigate("/login");
        } else if (adminOnly && user.role !== 'recruiter') {
            navigate("/forbidden");
        }
    }, [user, navigate, adminOnly]);

    return (
        <>
            {children}
        </>
    )
};

export default ProtectedRoute;
