import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    return <div>
    I am in Login Component
    <div>
        <button className="btn btn-ghost" onClick={() => navigate("/signup")}>Signup</button>

    </div>
    </div>
}
export default Login