import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { chainId, cloudPath, contract, contractAbi } from "../../config/config";
import styles from "./explore.module.css";
import Web3 from "web3";
import { AuthContext } from "../../context/authContext";

export default function ExplorePage() {
    const [competitions, setCompetitions] = useState<any>([]);
    const [challenge, setChallenge] = useState<any>(null);
    const [link, setLink] = useState("");
    const [message, setMessage] = useState("");
    const [address, setAddress] = useState("");
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            let res = await axios.get(`${cloudPath}/getCompetitions`, {withCredentials: true});
            setCompetitions(res.data.competitions);
        }
        fetchData();
    }, []);

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

    const submit = async () => {
        if (!loading) {
            setLoading(true);
            if (link) {
                if (user.wallet === address) {
                    try {
                        const contractObj = new window.web3.eth.Contract(contractAbi, contract);
                        const functionName = 'submitWork';
                        const transactionObject = {
                            from: address,
                            to: contract,
                            data: contractObj.methods[functionName](challenge.index).encodeABI(),
                            gas: "210000"
                        };
                        console.log("Transaction successful.");
                        await window.web3.eth.sendTransaction(transactionObject);
                        console.log("Transaction successful.");
                        await axios.post(`${cloudPath}/submit`, {link: link, competitionId: challenge._id}, {withCredentials: true});
                        setChallenge({...challenge, participants: challenge.participants + 1});
                        let newCompetitions = competitions.map((competition : any) => {
                            if (competition._id === challenge._id) {
                                return {...competition, participants: competition.participants + 1};
                            }
                            return competition;
                        });
                        setCompetitions(newCompetitions);
                        setMessage("Submission successful.");
                        setLink("");
                    } catch (err : any) {
                        console.log(err);
                        setMessage(err.response.data.message);
                    }
                } else {
                    setMessage("Please connect the wallet associated to your account.");    
                }
            } else {
                setMessage("Please insert a link.");
            }
            setLoading(false);
        }
    };

    return  (
        <>
            {!challenge ?
                <>
                    <h1>Available Competitions</h1>
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
                                </div>
                            );
                        })}
                    </div>
                </>
            :
                <div className={styles.challenge}>
                    <h1>{challenge.title}</h1>
                    <p>Short Description: {challenge.shortDescription}</p>
                    <p>Detailed Description: {challenge.longDescription}</p>
                    <p>Deadline: {new Date(challenge.deadline).toDateString()}</p>
                    <p>Reward: {challenge.reward} BFT</p>
                    <p>Maximum submissions: {challenge.challengers}</p>
                    <p>Submissions: {challenge.participants}</p>
                    <p style={{fontWeight: "bold", fontSize: 20}}>Submit your work</p>
                    <input type="text" className={styles.input} placeholder="Link to your work..." value={link} onChange={(e) => setLink(e.target.value)}/>
                    <div style={{marginBottom: 20}}>
                        <p style={{fontWeight: "bold", fontSize: 20, marginTop: 20, marginBottom: 5}}>Linked wallet address</p>
                        {address ? address : "Please connect your wallet."}
                        {address && (user.wallet === address ? " (VALID)" : <><br />Wrong wallet. Please connect the wallet associated to your account.</>)}
                    </div>
                    <button onClick={() => setChallenge(null)}>Back</button>
                    <button onClick={() => submit()} style={{marginLeft: 10}}>{!loading ? "Submit" : "Loading..."}</button>
                    <br />
                    {message && <div style={{color: "red", marginTop: 20}}>{message}</div>}
                </div>
            }
        </>
    );
}