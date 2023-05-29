import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestTokensDto } from './dtos/requestTokens.dto';
import { DeployBallotDto } from './dtos/deployBallot.dto';
import { StoreDataDto } from './dtos/storeData.dto';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('last-block')
  getLastBlock() {
    return this.appService.getLastBlock();
  }

  @Get('contract-address')
  getAddress() {
    return this.appService.getAddress();
  }

  @Get('block-number')
  getBlockNumber() {
    return this.appService.getBlockNumber();
  }

  @Get('total-supply')
  getTotalSupply() {
    return this.appService.getTotalSupply();
  }

  @Get('balance/:address')
  getBalanceOf(@Param('address') address: string) {
    return this.appService.getBalanceOf(address);
  }

  @Get('transaction-receipt/')
  async getTransactionReceipt(@Query('hash') hash: string) {
    return this.appService.getTransactionReceipt(hash);
  }

  @Post('request-tokens')
  requestTokens(@Body() body: RequestTokensDto) {
    return this.appService.requestTokens(body.address, body.signature);
  }

  @Post('deploy-ballot')
  deployBallot(@Body() body: DeployBallotDto) {
    return this.appService.deployBallotContract(body.proposals, body.end);
  }

  @Post('storeData')
  storeData(@Body() body: StoreDataDto): void {
    this.appService.storeData(body.address);
  }

  @Get('getData')
  getData(): string[] {
    return this.appService.getData();
  }
}
