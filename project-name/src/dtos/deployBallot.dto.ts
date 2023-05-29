import { ApiProperty } from "@nestjs/swagger";

export class DeployBallotDto {
    @ApiProperty()
    readonly proposals: string[];
    @ApiProperty()
    readonly end: number;
}