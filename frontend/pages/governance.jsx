import MainLayout from '../layout/MainLayout';
import styles from "../styles/InstructionsComponent.module.css";
import { Contract, ethers } from 'ethers';
import * as tokenJson from "../assets/MyToken.json";
import * as ballotJson from "../assets/Ballot.json";
import { useSigner } from 'wagmi';
import { useState } from 'react';

const Governance = () => {
    return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					Governance
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
};

function PageBody() {
	return (
		<div>
            <h1>Create a new Ballot</h1>
            <CreateBallot></CreateBallot>
            <h1>Mint Tokens</h1>
            <MintTokens></MintTokens>
            
		</div>
	)
}

function CreateBallot() {
    const { data: signer } = useSigner();
    const [txData, setTxData] = useState(null);
    const [stringArray, setStringArray] = useState([]); // Array to store the strings
    const [displayValue, setDisplayValue] = useState(null); // Value to be displayed
    const [snapValue, setSnapValue] = useState(null); // Value to be displayed
	const [isLoading, setLoading] = useState(false);
    if (txData) return (
		<div>
			<p>
				Transaction Completed!
			</p>
			<a href={"https://sepolia.etherscan.io/tx/" + txData.hash} target="_blank">{txData.hash}</a>
		</div>
	)
    if (isLoading) return <p>Deploying New Ballot...</p>
    return (
		<div>
            <h2>Add proposals</h2>
            <InputProposal stringArray={stringArray} setStringArray={setStringArray}></InputProposal>
            <h2>Input end block value</h2>
            <InputBlock displayValue={displayValue} setDisplayValue={setDisplayValue}></InputBlock>
            <button onClick={() => deployBallotContract(stringArray, displayValue, setLoading, setTxData, signer)}>Deploy Ballot</button>
		</div>
	)
}

async function deployBallotContract(proposals, end, setLoading, setTxData, signer){
    setLoading(true);
    const BallotContractFactory = new ethers.ContractFactory(
            ballotJson.abi,
            ballotJson.bytecode.object,
            signer
        );
    const tokenAddress = await getTokenAddress();
    const blockNumber = await getBlockNumber();

    const proposalsBytes32 = proposals.map(str => ethers.utils.formatBytes32String(str));
    
    const ballotContract = await BallotContractFactory.deploy(
      proposalsBytes32,
      tokenAddress,
      ethers.BigNumber.from(blockNumber),
      ethers.BigNumber.from(end)
    );

    await ballotContract.deployed();
    storeData(ballotContract.address);
    setTxData(ballotContract.deployTransaction);
}

async function storeData(address) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ address: address }),
    };
    fetch('http://localhost:3001/storeData', requestOptions);
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

async function getBlockNumber() {
    try {
        const response = await fetch('http://localhost:3001/block-number');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blockNumber = await response.json();
        return blockNumber; 
      } catch (error) {
        console.log('There was a problem with the fetch operation: ', error);
      }
}

function MintTokens() {
    const { data: signer } = useSigner();
    const [txData, setTxData] = useState(null);
    const [displayValue, setDisplayValue] = useState(null); // Value to be displayed
    const [snapValue, setSnapValue] = useState(null); // Value to be displayed
    const [isLoading, setLoading] = useState(false);

    if (txData) return (
		<div>
			<p>
				Transaction Completed!
			</p>
			<a href={"https://sepolia.etherscan.io/tx/" + txData.hash} target="_blank">{txData.hash}</a>
		</div>
	)
    if (isLoading) return <p>Tokens being minted...</p>
    return (
		<div>
            <h2>Input Address</h2>
            <InputString displayValue={displayValue} setDisplayValue={setDisplayValue}></InputString>
            <h2>Input Amount</h2>
            <InputEndBlock snapValue={snapValue} setSnapValue={setSnapValue}></InputEndBlock>
            <button onClick={() => mint(signer, displayValue, snapValue, setLoading, setTxData)}>Mint Tokens</button>
		</div>
	)
}

async function mint(signer, address, amount, setLoading, setTxData) {
    setLoading(true);
    const tokenAddress = getTokenAddress();
    const TokenContract = new ethers.Contract(
            tokenAddress,
            tokenJson.abi,
            signer
        );
    const response = await TokenContract.mint(address, ethers.utils.parseEther(amount));
    setTxData(response);
    
}

function InputProposal({stringArray, setStringArray}) {
    const [inputValue, setInputValue] = useState(''); // To handle the current input value

    const handleChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleClick = () => {
        setStringArray(prevArray => [...prevArray, inputValue]); // Add the input value to the array
        setInputValue(''); // Clear the input field
    }

    return (
        <div>
            <input type="text" value={inputValue} onChange={handleChange} />
            <button onClick={handleClick}>Add Proposal</button>
            <div>
                <h4>Proposal:</h4>
                {stringArray.map((str, index) => <p key={index}>{str}</p>)}
            </div>
        </div>
    )
}

function InputBlock({displayValue, setDisplayValue}) {
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

function InputString({displayValue, setDisplayValue}) {
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
            <input type="string" value={inputValue} onChange={handleChange} />
            <button onClick={handleClick}>Submit</button>
            <div>
                <h4>Submitted Value:</h4>
                <p>{displayValue}</p>
            </div>
        </div>
    )

}

function InputEndBlock({snapValue, setSnapValue}) {
    const [inputValue, setInputValue] = useState(''); // To handle the current input value

    const handleChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleClick = () => {
        setSnapValue(inputValue); // Set the display value to the input value
        setInputValue(''); // Clear the input field
    }

    return (
        <div>
            <input type="number" value={inputValue} onChange={handleChange} />
            <button onClick={handleClick}>Submit</button>
            <div>
                <h4>Submitted Value:</h4>
                <p>{snapValue}</p>
            </div>
        </div>
    )

}

Governance.layout = MainLayout;
export default Governance;
