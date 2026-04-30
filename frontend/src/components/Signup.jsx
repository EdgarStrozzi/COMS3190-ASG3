import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    return <div>
        I am in signup Component
        <div>
            <button className="btn btn-ghost" onClick={() => navigate("/")}>I Have an Account</button>
        </div>
    </div>
}
export default Signup