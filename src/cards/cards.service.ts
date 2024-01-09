import { Injectable, NotFoundException } from '@nestjs/common';
import { CardsModel } from './entities/cards.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(CardsModel)
        private cardRepository: Repository<CardsModel>,
    ) {}

    async createCards(createCardDto: CreateCardDto, userId: number, listId: number) {
        const findCards = await this.cardRepository.find({
            where: {
                list: {
                    id: listId,
                },
            },
        });
        // 생성 카드 정의.
        const card = this.cardRepository.create({
            title: createCardDto.title,
            description: createCardDto.description,
            color: createCardDto.color,
            order: findCards.length + 1,
            user: {
                id: userId,
            },
            list: {
                id: listId,
            },
        });

        // 정의된 카드 repository에 save
        await this.cardRepository.save(card);

        return { card, message: '카드 생성 완료' };
    }

    async getAllcards(listId: number) {
        const foundCard = await this.cardRepository.find({
            select: ['id', 'title'],
            where: {
                list: {
                    id: listId,
                },
            },
        });

        return { foundCard, message: '카드 목록 조회 성공' };
    }

    async findOneById(id: number) {
        const card = await this.cardRepository.findOneBy({ id });

        if (!card) {
            throw new NotFoundException(' 해당 Card는 존재하지 않습니다.');
        }

        return { card, message: '카드 조회 완료' };
    }

    async deleteCard(id: number) {
        const result = await this.cardRepository.delete(id);
        return { result, message: 'card 삭제 완료' };
    }

    async updateCard(id: number, updateCardDto: UpdateCardDto) {
        // const card = 수정할 수 있게, 현재 존재하는 카드 정의
        //const card = await this.availableCardById(id);

        const card = await this.availableCardById(id);
        this.cardRepository.merge(card, updateCardDto);
        const updatedCard = this.cardRepository.save(card);

        return { updatedCard, message: '카드가 정상적으로 수정되었습니다.' };
    }
    /**
     * 존재하는 카드인지 아닌지 확인 할 수 있는 내부함수
     */
    private async availableCardById(id: number) {
        const card = await this.cardRepository.findOne({
            where: {
                id,
            },
        });

        if (!card) {
            throw new NotFoundException('해당 카드는 존재하지 않습니다.');
        }

        return card;
    }
}
