import { PickType } from '@nestjs/mapped-types';
import { CardsModel } from '../entities/cards.entity';

export class CreateCardDto extends PickType(CardsModel, ['title', 'color', 'description']) {}
