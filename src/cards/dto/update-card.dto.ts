import { PartialType } from '@nestjs/mapped-types';
import { CardsModel } from '../entities/cards.entity';

export class UpdateCardDto extends PartialType(CardsModel) {}
