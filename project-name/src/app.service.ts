import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import * as tokenJson from "./assets/MyToken.json";
import * as ballotJson from "./assets/Ballot.json";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider
  contract: ethers.Contract;
  private data: string[] = [];
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('INFURA_API_KEY');
    this.provider = new ethers.providers.InfuraProvider('sepolia', apiKey);
    this.contract = new Contract(this.getAddress(), tokenJson.abi, this.provider);
  }

  getHello(): string {
    return 'Hello World!';
  }

  getLastBlock() {
    return this.provider.getBlock('latest');
  }

  getAddress() {
    // Get address from deployed TokenBallot
    const tokenAddress = this.configService.get<string>('TOKEN_ADDRESS');
    return tokenAddress;
  }

  getTotalSupply() {
    return this.contract.totalSupply();
  }

  getBalanceOf(address: string) {
    return this.contract.balanceOf(address);
  }

  storeData(address: string) {
    this.data.push(address); // Add new data to array
  }

  getData(): string[] {
    return this.data; // Return all stored data
  }

  async getBlockNumber() {
    const blockNumber = await this.provider.getBlockNumber();
    return blockNumber;
  }

  async getTransactionReceipt(hash: string) {
    const tx = await this.provider.getTransaction(hash);
    const receipt = await tx.wait();
    return receipt;
  }

  async requestTokens(address: string, signature: string) {
    const pKey = this.configService.get<string>('PRIVATE_KEY');
    const wallet = new ethers.Wallet(pKey);
    const signer = wallet.connect(this.provider);
    return this.contract.connect(signer).mint(address, ethers.utils.parseEther('1'));
  }
}
