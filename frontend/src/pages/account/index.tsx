import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import styles from "./account.module.css";
import Web3 from "web3";

export default function AccountPage() {
    const { user } = useContext(AuthContext);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        async function getBalance(address : string) {
            window.web3 = new Web3(window.ethereum);     
            let balance = await window.web3.eth.getBalance(address);
            balance = window.web3.utils.fromWei(balance, 'ether');
            console.log(balance);
            setBalance(balance);
        }
        getBalance(user.wallet);
    }, [user.wallet]);

    return (
        <div className={styles.container}>
            <div><b>Username:</b> {user.username}</div>
            <div><b>Wallet Address:</b> {user.wallet}</div>
            <div><b>Balance:</b> {balance} BFT</div>
        </div>
    );
}