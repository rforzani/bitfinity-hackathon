import { useState } from "react";
import styles from "./login.module.css";

export default function ProjectRegistration() {
    const [projectTitel, setprojectTitel] = useState("");
    const [shortDescription, setshortDescription] = useState("");
    const [scope, setScope] = useState("");
    const [deadline, setDeadline] = useState("");
    const [reward, setReward] = useState("");
    const [numberOfChallengers, setNumberOfChallengers] = useState("");

    return (
        <div className={styles.container}>
            <h1>Register a new project</h1>
            <input type="text" className={styles.input} placeholder="Title" onChange={(e) => setprojectTitel(e.target.value)} />
            <input type="text" className={styles.input} placeholder="Short Description" onChange={(e) => setshortDescription(e.target.value)} />
            <input type="text" className={styles.input} placeholder="Scope" onChange={(e) => setScope(e.target.value)} />
            <input type="text" className={styles.input} placeholder="Deadline" onChange={(e) => setDeadline(e.target.value)} />
            <input type="text" className={styles.input} placeholder="Reward" onChange={(e) => setReward(e.target.value)} />
            <input type="text" className={styles.input} placeholder="Number of Challengers" onChange={(e) => setNumberOfChallengers(e.target.value)} />
        </div>
    );
}