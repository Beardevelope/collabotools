import { Injectable, NotFoundException } from '@nestjs/common';
import { CardsModel } from './entities/cards.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { LexoRank } from 'lexorank';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(CardsModel)
        private cardRepository: Repository<CardsModel>,
        private readonly usersService: UsersService,
    ) {}

    async createCards(createCardDto: CreateCardDto, userId: number, listId: number) {
        const findCards = await this.cardRepository.find({
            where: {
                list: {
                    id: listId,
                },
            },
        });

        let newLexoRank: LexoRank;
        if (findCards.length > 0) {
            newLexoRank = LexoRank.parse(findCards[findCards.length - 1].order).genNext();
        } else {
            newLexoRank = LexoRank.middle();
            /**
             *  min말고 middle로 하는 경우가 좋다고함.
             * update시에 0.10000e 식으로 나오는걸 lexoRankParse 를 검색해보기.
             *  */
        }

        // 생성 카드 정의.
        const card = this.cardRepository.create({
            title: createCardDto.title,
            description: createCardDto.description,
            color: createCardDto.color,
            deadline: createCardDto.deadline, // jihye: 마감일 추가
            order: newLexoRank.toString(),
            user: {
                id: userId,
            },
            list: {
                id: listId,
            },
        });

        // 정의된 카드 repository에 save
        await this.cardRepository.save(card);

        const daysLeft = this.calculateDaysLeft(card.deadline);

        return { card, daysLeft, message: '카드 생성 완료' };
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

    /**
     *
     * @param id
     * @returns
     */

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
        const card = await this.availableCardById(id);
        this.cardRepository.merge(card, updateCardDto);
        const updatedCard = this.cardRepository.save(card);
        const daysLeft = this.calculateDaysLeft(card.deadline); // jihye: 마감일 디데이 추가
        return { updatedCard, daysLeft, message: '카드가 정상적으로 수정되었습니다.' };
    }

    /**
     * Find By Id(card) 내부함수
     */
    private async availableCardById(id: number) {
        const card = await this.cardRepository.findOne({
            where: {
                id,
            },
            relations: { workers: true },
            // 관계가 없으면 불러올수없음 135
        });

        if (!card) {
            throw new NotFoundException('해당 카드는 존재하지 않습니다.');
        }

        return card;
    }

    /**
     *  Find By Id 내부함수
     */

    private async availableUserById(userId: number) {
        const user = await this.usersService.getUser(userId);

        if (!user) {
            throw new NotFoundException('해당 유저는 존재하지 않습니다.');
        }

        return user;
    }

    /**
     * 작업자 user 추가 API
     */

    async addUserToCard(cardId: number, userId: number) {
        const card = await this.availableCardById(cardId);
        const user = await this.availableUserById(userId);

        card.workers = [...card.workers, user];

        await this.cardRepository.save(card);

        return { newMember: user, message: '작업자 추가' };
    }

    async updateCardOrder(listId: number, cardId: number, rankId: string) {
        const findAllCard = await this.cardRepository.find({
            where: {
                list: {
                    id: listId,
                },
            },
            order: {
                order: 'ASC',
            },
        });

        /**
         * 코드 상 끼고싶은 orderId ( y|x 의 x의 값)을 넣어주면 원하는 값 사이에 위치가 이동된다.
         */
        const findIdx = findAllCard.findIndex((card) => {
            return card.order === rankId;
        });

        let moveLexoRank: LexoRank;
        if (findIdx === 0) {
            moveLexoRank = LexoRank.parse(findAllCard[findIdx].order).genPrev();
        } else if (findIdx === findAllCard.length - 1) {
            moveLexoRank = LexoRank.parse(findAllCard[findIdx].order).genNext();
        } else {
            moveLexoRank = LexoRank.parse(findAllCard[findIdx].order).between(
                LexoRank.parse(findAllCard[findIdx - 1].order),
            );
        }

        await this.cardRepository.update({ id: cardId }, { order: moveLexoRank.toString() });
    }

    /**
     * jihye
     * D-day 추가
     */
    private calculateDaysLeft(deadline: Date): number | { message: string } {
        const currentDate = new Date();
        const deadlineDate = new Date(deadline);

        // 디데이 계산
        const daysLeft = Math.ceil(
            (deadlineDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24),
        );

        if (daysLeft === 0) {
            return { message: '마감일이 오늘입니다.' };
        }

        return daysLeft >= 0 ? daysLeft : { message: '마감 기한이 지났습니다.' };
    }
}
