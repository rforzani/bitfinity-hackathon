import axios from "axios";
import { useEffect, useState } from "react";
import { chainId, cloudPath, contract, contractAbi } from "../../config/config";
import styles from "./manage.module.css";
import Web3 from "web3";

export default function ManagePage() {
    const [competitions, setCompetitions] = useState<any>([]);
    const [challenge, setChallenge] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        async function fetchWalletData() {
            if (window && window.ethereum) {
                let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: Web3.utils.toHex(chainId) }],
                });
                window.web3 = new Web3(window.ethereum);
                setAddress(accounts[0]);
            }     
        }
        fetchWalletData();

        window.ethereum.on('accountsChanged', function (accounts : any) {
            setAddress(accounts[0]);
        });
    }, []);

    useEffect(() => {
        async function fetchData() {
            let res = await axios.get(`${cloudPath}/getAllCompetitions`, {withCredentials: true});
            setCompetitions(res.data.competitions);
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchSubmissions() {
            let res = await axios.post(`${cloudPath}/getSubmissions`, { challenge: challenge._id }, {withCredentials: true});
            setSubmissions(res.data.submissions);
        }
        if (challenge) {
            fetchSubmissions();
        }
    }, [challenge]);

    const chooseSubmission = async (addr : string) => {
        if (!loading) {
            setLoading(true);
            try {
                const contractObj = new window.web3.eth.Contract(contractAbi, contract);
                const functionName = 'pickWinner';
                const transactionObject = {
                    from: address,
                    to: contract,
                    data: contractObj.methods[functionName](challenge.index, addr).encodeABI(),
                    gas: "210000"
                };
                console.log(transactionObject);
                await window.web3.eth.sendTransaction(transactionObject);
                console.log("Transaction sent");
                await axios.post(`${cloudPath}/pickWinner`, { challenge: challenge._id, winner: address }, {withCredentials: true});
                setChallenge({...challenge, open: false});

            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        }
    }

    return (
        <>
            {!challenge ?
                <>
                    <h1>Your tasks</h1>
                        {competitions.length ? 
                            <div className={styles.container}>
                                {competitions.map((competition : any) => {
                                    return (
                                        <div key={competition._id} className={styles.projectContainer} onClick={() => setChallenge(competition)}>
                                            <h2>{competition.title}</h2>
                                            <p>Short Description: {competition.shortDescription}</p>
                                            <p>Deadline: {new Date(competition.deadline).toDateString()}</p>
                                            <p>Reward: {competition.reward} BFT</p>
                                            <p>Maximum submissions: {competition.challengers}</p>
                                            <p>Submissions: {competition.participants}</p>
                                            <p>Winner: {competition.open ? "Not determined" : "determined"}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        :
                            <div style={{textAlign: "center"}}>You have not created any tasks yet. Start by adding one.</div>
                        }
                </>
            :
                <>
                    <div className={styles.challenge}>
                        <h1>{challenge.title}</h1>
                        <p>Short Description: {challenge.shortDescription}</p>
                        <p>Detailed Description: {challenge.longDescription}</p>
                        <p>Deadline: {new Date(challenge.deadline).toDateString()}</p>
                        <p>Reward: {challenge.reward} BFT</p>
                        <p>Maximum submissions: {challenge.challengers}</p>
                        <p>Submissions: {challenge.participants}</p>
                        {challenge.open ?
                            <>
                                <p style={{fontWeight: "bold", fontSize: 20}}>Check the submissions</p>
                                {challenge.participants > 0 ?
                                    <>
                                        {submissions.map((submission : any) => {
                                            return (
                                                <div key={submission._id} className={styles.submission}>
                                                    <p>Link: {submission.link}</p>
                                                    <p>Submitted by: {submission.address}</p>
                                                    <button onClick={() => chooseSubmission(submission.address)} style={{backgroundColor: "white", marginBottom: 10}}>{!loading ? "Pick" : "Loading..."}</button>
                                                </div>
                                            );
                                        })}
                                    </>
                                :
                                    <>No participants yet<br /></>
                                }
                            </>
                        :   
                            <div style={{marginTop: 10}}>
                                This challenge is closed and its winner has been determined.
                            </div>
                        }
                        <button style={{marginTop: 20}} onClick={() => setChallenge(null)}>Back</button>
                    </div>
                </>
            }
        </>
    );    
}