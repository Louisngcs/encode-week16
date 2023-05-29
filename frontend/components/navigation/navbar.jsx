import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSigner } from 'wagmi';
import styles from "../../styles/Navbar.module.css";
import Link  from "next/link";
export default function Navbar() {
	
	return (
		<nav className={styles.navbar}>
			<a href="https://alchemy.com/?a=create-web3-dapp" target={"_blank"}>
				<img className={styles.alchemy_logo} src="/cw3d-logo.png"></img>
			</a>
			<div className={styles.page}>
                <Link href="/">User</Link>
			</div>
			<div className={styles.page}>
                <Link href="/ballots">Ballots</Link>
            </div>
			<GovernancePage></GovernancePage>			
			<ConnectButton></ConnectButton>
		</nav>
	);
}

function GovernancePage() {
	const { data: signer } = useSigner();
	const governorAddress = "0x9620daf4fE148e8dCB58745f35BE24AE30503535";
	if (!signer) return; 
	if (signer._address === governorAddress) return (
		<div className={styles.page}>
			<Link href="/governance">Governance</Link>
		</div>		
	)
}

