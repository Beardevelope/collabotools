import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateListDto } from '../dto/create-list.dto';

export class UpdateListDto extends PickType(CreateListDto, ['title']) {
    @IsString()
    @IsNotEmpty({ message: '리스트의 제목을 입력해주세요.' })
    title: string;
}
