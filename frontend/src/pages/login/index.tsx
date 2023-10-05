import { useState } from "react";
import styles from "./login.module.css";
import axios from "axios";
import { cloudPath } from "../../config/config";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async () => {
        if (!loading) {
            setLoading(true);
            try {
                await axios.post(`${cloudPath}/standardLogin`, {username: username, password: password}, {withCredentials: true});
                window.location.replace("/account");
            } catch (err : any) {
                setMessage(err.response.data.message);
            }
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Login</h1>
            <input type="text" className={styles.input} placeholder="Username..." onChange={(e) => setUsername(e.target.value)} />
            <input type="password" className={styles.input} placeholder="Password..." onChange={(e) => setPassword(e.target.value)} />
            <button className={styles.confirmBtn} onClick={() => login()}>{loading ? "Loading..." : "Confirm"}</button>
            {message && <span style={{color: "red"}}>{message}</span>}
        </div>
    );
}