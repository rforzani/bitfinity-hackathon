import { useContext, useEffect, useState } from "react";
import styles from "./projectregistration.module.css";
import axios from "axios";
import { chainId, cloudPath, contract, contractAbi } from "../../config/config";
import Web3 from "web3";
import { AuthContext } from "../../context/authContext";

export default function ProjectRegistration() {
    const { user } = useContext(AuthContext);
    const [projectTitle, setProjectTitle] = useState("");
    const [shortDescription, setshortDescription] = useState("");
    const [detailedDescription, setDetailedDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [reward, setReward] = useState("");
    const [numberOfChallengers, setNumberOfChallengers] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState("");

    useEffect(() => {
        async function getBalance(address : string) {
            let balance = await window.web3.eth.getBalance(address);
            balance = window.web3.utils.fromWei(balance, 'ether');
            setBalance(balance);
        }
        async function fetchWalletData() {
            if (window && window.ethereum) {
                let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: Web3.utils.toHex(chainId) }],
                });
                window.web3 = new Web3(window.ethereum);
                setAddress(accounts[0]);
                getBalance(accounts[0]);
            }     
        }
        fetchWalletData();

        window.ethereum.on('accountsChanged', function (accounts : any) {
            setAddress(accounts[0]);
            getBalance(accounts[0]);
        });
    }, []);

    const submit = async () => {
        if (!loading) {
            if (parseInt(balance as string) >= parseInt(reward)) {
                setLoading(true);
                try {
                    const contractObj = new window.web3.eth.Contract(contractAbi, contract);

                    const functionName = 'createCompetition';
                    const transactionObject = {
                        from: address,
                        to: contract,
                        data: contractObj.methods[functionName](projectTitle, numberOfChallengers).encodeABI(),
                        gas: "210000",
                        value: window.web3.utils.toWei(reward, 'ether')
                    };
                    let res = await window.web3.eth.sendTransaction(transactionObject);
                    console.log(res);
                    let index = parseInt(res.logs[0].topics[1], 16);
                    await axios.post(`${cloudPath}/createProject`, {title: projectTitle, shortDescription: shortDescription, longDescription: detailedDescription, deadline: deadline, reward: reward, challengers: numberOfChallengers, index: index}, {withCredentials: true})
                    setMessage("Task created successfully!");
                    setProjectTitle("");
                    setshortDescription("");
                    setDetailedDescription("");
                    setDeadline("");
                    setReward("");
                    setNumberOfChallengers("");
                } catch (err : any) {
                    setMessage(err.response.data.message);
                }
                setLoading(false);   
            } else {
                setMessage("You don't have enough BFT in your wallet to create this task.");
            }
        }
    };


    return (
        <div className={styles.container}>
            <h1>Register a new project</h1>
            <div className={styles.innerContainer}>
                <input type="text" className={styles.input} placeholder="Title..." onChange={(e) => setProjectTitle(e.target.value)} value={projectTitle}/>
                <input type="text" className={styles.input} placeholder="Short Description..." onChange={(e) => setshortDescription(e.target.value)} value={shortDescription}/>
                <textarea className={styles.input} placeholder="Detailed Description..." onChange={(e) => setDetailedDescription(e.target.value)} style={{maxWidth: 505, minWidth: 505, minHeight: 150, lineHeight: 2}} value={detailedDescription}/>
                <input type="text" className={styles.input} placeholder="Deadline (example: 2023-05-22)..." onChange={(e) => setDeadline(e.target.value)} value={deadline}/>
                <input type="text" className={styles.input} placeholder="Number of Challengers..." onChange={(e) => setNumberOfChallengers(e.target.value)} value={numberOfChallengers}/>
                <div style={{textAlign: "left"}}>
                    <div><b>Connected Wallet</b></div>
                    {address} { address === user.wallet && "(VALID)"}
                    <br />
                    {address !== user.wallet && "This wallet is not your account wallet. Please connect the correct one."}
                    <div style={{marginTop: 5}}><b>Balance: </b>{balance} BFT</div>
                </div>
                <input type="text" className={styles.input} placeholder="Reward (in BFT)..." onChange={(e) => setReward(e.target.value)} value={reward}/>
                <button className={styles.confirmBtn} onClick={() => submit()}>{loading ? "Loading..." : "Confirm"}</button>
                {message && <span style={{color: "red", textAlign: "left"}}>{message}</span>}
            </div>
        </div>
    );
}