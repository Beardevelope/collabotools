import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty({ message: '워크스페이스명을 입력해주세요.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '워크스페이스 내용를 입력해주세요.' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: '색상을 입력해주세요.' })
  color: string;
}
