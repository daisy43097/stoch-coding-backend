import {IsNumber, IsOptional, IsString} from "class-validator";

export class getNameByPageDTO {
  @IsOptional()
  @IsNumber()
  beforeCursor: number

  @IsOptional()
  @IsNumber()
  afterCursor: number
}