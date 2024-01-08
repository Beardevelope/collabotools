import { ArrayMinSize, ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class MembersDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  members: MemberDto[];
}

export class MemberDto {
  @IsObject()
  @IsInt()
  userId: number;

  @IsObject()
  @IsInt()
  workspaceId: number;
}