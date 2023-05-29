import MainLayout from '../layout/MainLayout';
import styles from "../styles/InstructionsComponent.module.css";
import Link  from "next/link";
import { useState, useEffect } from 'react';

const Ballots = () => {
    return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					Ballots
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
		    <BallotButton></BallotButton>

        </div>
	)
}

function BallotButton() {
    const [txData, setTxData] = useState(null);
    const [isLoading, setLoading] = useState(false);

    if (Array.isArray(txData)) return (
		<div>
            <h1>Select a Ballot</h1>
            <List strings={txData}/>		
		</div>
	)
    if (isLoading) return <p>Loading Ballots...</p>
    return (
		<div>
            <button onClick={() => getBallotAddresses(setLoading, setTxData)}>Get Ballots</button>
		</div>
	)
}

function List({strings}) {
    return (
        <div>
          {strings.map((string, index) => (
            <div key={index}>
              <Link href={`/vote/${string}`}>
                Ballot {index + 1}: {string}
              </Link>
            </div>
          ))}
        </div>
      )
}

async function getBallotAddresses(setLoading, setTxData) {
    setLoading(true);
    try {
        const response = await fetch('http://localhost:3001/getData');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const addresses = await response.json();
        console.log(addresses);
        setTxData(addresses);
      } catch (error) {
        console.log('There was a problem with the fetch operation: ', error);
      }
}


Ballots.layout = MainLayout;
export default Ballots;
