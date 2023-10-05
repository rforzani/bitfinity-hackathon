import { useState, useEffect } from "react";
import styles from "./singup.module.css";
import { Select } from "../../components/select/select";
import axios from "axios";
import { cloudPath } from "../../config/config";
import Web3 from "web3";
import { chainId } from "../../config/config";

const accountTypeOptions = [
    { value: "freelancer", label: "Freelancer" },
    { value: "business", label: "Business" }
];

export default function Signup() {
    const [selectedAccountType, setSelectedAccountType] = useState("");
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState("");

    useEffect(() => {
        async function getAccounts() {
            if (window && window.ethereum) {
               let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
               await window.ethereum.request({
                   method: 'wallet_switchEthereumChain',
                   params: [{ chainId: Web3.utils.toHex(chainId) }],
               });
               window.web3 = new Web3(window.ethereum);
               setAccount(accounts[0]);
           }     
       }
        getAccounts();

        window.ethereum.on('accountsChanged', function (accounts : any) {
            setAccount(accounts[0]);
        });
    }, []);

    const onAccountTypeSelect = (type: string) => {
        setSelectedAccountType(type);
    };

    const signup = async () => {
        if (!loading) {
            setLoading(true);
            try {
                await axios.post(`${cloudPath}/signup`, {firstName: firstName, lastName: lastName, password: password, accountType: selectedAccountType, username: username, wallet: account}, {withCredentials: true});
                setMessage("Signup successful!");
                setUsername("");
                setPassword("");
                setFirstName("");
                setLastName("");
                setSelectedAccountType("");
            } catch (err : any) {
                setMessage(err.response.data.message);
            }
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Signup</h1>
            <input type="text" className={styles.input} placeholder="First Name..." onChange={(e) => setFirstName(e.target.value)} value={firstName}/>
            <input type="text" className={styles.input} placeholder="Last Name..." onChange={(e) => setLastName(e.target.value)} value={lastName}/>
            <input type="text" className={styles.input} placeholder="Username..." onChange={(e) => setUsername(e.target.value)} value={username}/>
            <input type="password" className={styles.input} placeholder="Password..." onChange={(e) => setPassword(e.target.value)} value={password}/>
            <Select placeholder="Select an account type" className={styles.select} onChange={(value : any) => onAccountTypeSelect(value)} options={accountTypeOptions} value={selectedAccountType} />
            <label><b>Connected Wallet Address</b></label>
            {account ? account : "No wallet currently connected. Please connect."}
            <button className={styles.confirmBtn} onClick={() => signup()}>{loading ? "Loading..." : "Confirm"}</button>
            {message && <span style={{color: "red"}}>{message}</span>}
        </div>
    );
}