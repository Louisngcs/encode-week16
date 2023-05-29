import { ApiProperty } from "@nestjs/swagger";

export class StoreDataDto {
    @ApiProperty()
    readonly address: string;
}

