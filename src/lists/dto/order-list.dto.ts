import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsInt } from 'class-validator';
import { CreateListDto } from '../dto/create-list.dto';

export class OrderListDto extends PickType(CreateListDto, ['order']) {
    @IsInt()
    @IsNotEmpty({ message: 'order를 입력해주세요.' })
    order: number;
}
