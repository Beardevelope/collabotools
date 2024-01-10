import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateListDto {
    @IsString()
    @IsNotEmpty({ message: '리스트의 제목을 입력해주세요.' })
    title: string;

    @IsInt()
    @IsNotEmpty({ message: 'order 번호를 입력해주세요.' })
    order: number;

    // @IsInt()
    // @IsNotEmpty({ message: 'workspace 번호를 입력해주세요.' })
    // workspaceId: number;
}
