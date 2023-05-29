import MainLayout from '../../layout/MainLayout';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Contract, ethers } from 'ethers';
import styles from "../../styles/InstructionsComponent.module.css";
import * as ballotJson from "../../assets/Ballot.json";
import { useSigner } from 'wagmi';


const Vote = () => {
	const router = useRouter();
	const { id } = router.query;
    return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					Vote for this ballot
				</h1>
				<h4>Contract address: {id}</h4>
			</header>
			<div className={styles.buttons_container}>
				<PageBody id={id}></PageBody>
			</div>
			<div className={styles.footer}>
				Footer
			</div>
		</div>
	);

};

function PageBody({id}) {
	return (
		<div>
            <h1>Vote here</h1>
			<VoteBlock id={id}></VoteBlock>
		</div>
	)
}

function VoteBlock({id}) {
	const { data: signer } = useSigner();
	const [txData, setTxData] = useState(null);
    const [displayValue, setDisplayValue] = useState(null); // Value to be displayed
	const [amount, setAmount] = useState(null); // Value to be displayed
	const [isLoading, setLoading] = useState(false);

	if (txData) return (
		<div>
			<p>
				Transaction Completed!
			</p>
			<a href={"https://sepolia.etherscan.io/tx/" + txData.hash} target="_blank">{txData.hash}</a>
		</div>
	)
	if (isLoading) return <p>Voting...</p>
	return (
		<div>
            <h2>Input Proposal</h2>
            <InputProposal displayValue={displayValue} setDisplayValue={setDisplayValue}></InputProposal>
            <h2>Input Amount</h2>
            <InputBlock amount={amount} setAmount={setAmount}></InputBlock>
            <button onClick={() => vote(signer, id, displayValue, amount, setLoading, setTxData)}>Vote</button>
		</div>
	)

}

async function vote(signer, address, displayValue, amount, setLoading, setTxData) {
	setLoading(true);
	const BallotContract = new ethers.Contract(
		address,
		ballotJson.abi,
		signer
	);
	const response = await BallotContract.vote(displayValue, ethers.utils.parseEther(amount));
	setTxData(response);
}

function InputProposal({displayValue, setDisplayValue}) {
    const [inputValue, setInputValue] = useState(''); // To handle the current input value

    const handleChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleClick = () => {
        setDisplayValue(inputValue); // Set the display value to the input value
        setInputValue(''); // Clear the input field
    }

    return (
        <div>
            <input type="number" value={inputValue} onChange={handleChange} />
            <button onClick={handleClick}>Submit</button>
            <div>
                <h4>Submitted Value:</h4>
                <p>{displayValue}</p>
            </div>
        </div>
    )

}

function InputBlock({amount, setAmount}) {
    const [inputValue, setInputValue] = useState(''); // To handle the current input value

    const handleChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleClick = () => {
        setAmount(inputValue); // Set the display value to the input value
        setInputValue(''); // Clear the input field
    }

    return (
        <div>
            <input type="number" value={inputValue} onChange={handleChange} />
            <button onClick={handleClick}>Submit</button>
            <div>
                <h4>Submitted Value:</h4>
                <p>{amount}</p>
            </div>
        </div>
    )

}


Vote.layout = MainLayout;
export default Vote;
