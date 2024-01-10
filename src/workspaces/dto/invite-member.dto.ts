import { ArrayMinSize, ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class MembersDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  members: number[];
}