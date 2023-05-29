import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import { useSigner, useNetwork, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';
import { Contract, ethers } from 'ethers';
import * as tokenJson from "../assets/MyToken.json";

export default function InstructionsComponent() {
	const router = useRouter();
	return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					Your Profile
				</h1>
			</header>

			<div className={styles.buttons_container}>
				<PageBody></PageBody>
			</div>
			<div className={styles.footer}>
				Footer
			</div>
		</div>
	);
}

function PageBody() {
	return (
		<div>
			<h2>Your Profile</h2>
			<WalletInfo></WalletInfo>
			{/* <RequestTokens></RequestTokens> */}
			<h2>Delegate</h2>
			<Delegate></Delegate>
			<h2>Vote</h2>
			<Vote></Vote>
		</div>
	)
}

function WalletInfo() {
	const { data: signer, isError, isLoading } = useSigner();
	const { chain, chains } = useNetwork();
	if (signer) return (
		<>
			<p>Your account address is: {signer._address}</p>
			{/* <p>Connected to the {chain.name} network</p> */}
			{/* <button onClick={() => signMessage(signer, "I love potatoes")}>Sign</button> */}
			<WalletBalance></WalletBalance>
			<TokenBalance></TokenBalance>
		</>
	)
	else if (isLoading) return (
		<>
			<p>Loading...</p>
		</>
	)
	else return (
		<>
			<p>
				Connect to account to continue
			</p>
		</>
	)
}


function signMessage(signer, message) {
	signer.signMessage(message).then(
		(signature) => { console.log(signature) },
		(error) => { console.error(error) }
	)
}

function WalletBalance() {
	const { data: signer } = useSigner();
	const { data, isError, isLoading } = useBalance({ address: signer._address });
	if (isLoading) return (<div>Fetching Balance...</div>)
	if (isError) return (<div>Error</div>)
	return (<div>Balance: {data?.formatted}{data?.symbol}</div>)

}

function TokenBalance() {
	const { data: signer, isError, isLoading } = useSigner();
	const [tokenBalance, setTokenBalance] = useState(null);

	useEffect(() => {
		if (signer && signer._address) {
		getTokenBalance(signer._address)
			.then(balance => {
			setTokenBalance(balance);
			})
			.catch(error => console.log(error));
		}
	}, [signer]);
	if (isLoading) return (<div>Fetching Balance...</div>)
	if (isError) return (<div>Error</div>)
	return (<div>MToken Balance:  {tokenBalance ? tokenBalance : 'Loading...'}</div>)
}

async function getTokenBalance(address) {
	try {
        const response = await fetch('http://localhost:3001/balance/'+ address);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tokenBalance = await response.json();
        return ethers.utils.formatEther(tokenBalance.hex); 
      } catch (error) {
        console.log('There was a problem with the fetch operation: ', error);
      }
}

function Delegate() {
	const { data: signer } = useSigner();
    const [txData, setTxData] = useState(null);
    const [delegatee, setDelegatee] = useState(null);
	const [isLoading, setLoading] = useState(false);
	if (txData) return (
		<div>
			<p>
				Transaction Completed!
			</p>
			<a href={"https://sepolia.etherscan.io/tx/" + txData.hash} target="_blank">{txData.hash}</a>
		</div>
	)
    if (isLoading) return <p>Tokens being delegated...</p>
	return (
		<div>
            <h4>Input Delegatee Address</h4>
            <InputString delegatee={delegatee} setDelegatee={setDelegatee}></InputString>
            <button onClick={() => delegate(signer, delegatee, setLoading, setTxData)}>Delegate</button>
		</div>
	)
}

function InputString({delegatee, setDelegatee}) {
    const [inputValue, setInputValue] = useState(''); // To handle the current input value

    const handleChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleClick = () => {
        setDelegatee(inputValue); // Set the display value to the input value
        setInputValue(''); // Clear the input field
    }

    return (
        <div>
            <input type="string" value={inputValue} onChange={handleChange} />
            <button onClick={handleClick}>Submit</button>
            <div>
                <p>Submitted address: {delegatee}</p>
            </div>
        </div>
    )

}

async function delegate(signer, address, setLoading, setTxData){
	setLoading(true);
	const tokenAddress = getTokenAddress();
	const TokenContract = new ethers.Contract(
		tokenAddress,
		tokenJson.abi,
		signer
	);

	const response = await TokenContract.delegate(address);
	setTxData(response);
}

async function getTokenAddress() {
    try {
        const response = await fetch('http://localhost:3001/contract-address');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const address = await response.text();
        return address; 
      } catch (error) {
        console.log('There was a problem with the fetch operation: ', error);
      }
}


// function RequestTokens() {
// 	const { data: signer } = useSigner();
// 	const [txData, setTxData] = useState(null);
// 	const [isLoading, setLoading] = useState(false);
// 	if (txData) return (
// 		<div>
// 			<p>
// 				Transaction Completed!
// 			</p>
// 			<a href={"https://sepolia.etherscan.io/tx/" + txData.hash} target="_blank">{txData.hash}</a>
// 		</div>
// 	)
// 	if (isLoading) return <p>Requesting tokens to be minted...</p>
// 	return (
// 		<div>
// 			<button onClick={() => requestTokens(signer, "signature", setLoading, setTxData)}>Request Tokens</button>
// 		</div >
// 	)
// }

// function requestTokens(signer, signature, setLoading, setTxData) {
// 	setLoading(true);
// 	const requestOptions = {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify({ address: signer._address, signature: signature })
// 	};
// 	fetch('http://localhost:3001/request-Tokens', requestOptions)
// 		.then(response => response.json())
// 		.then((data) => {
// 			setTxData(data);
// 			setLoading(true);
// 		});
// }