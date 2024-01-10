import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsModel } from './entities/comments.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CardsModel } from 'src/cards/entities/cards.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentsModel)
        private readonly commentRepository: Repository<CommentsModel>,
        @InjectRepository(CardsModel)
        private readonly cardsRepository: Repository<CardsModel>,
    ) {}

    private async verifyCommentId(id: number): Promise<CommentsModel> {
        const comment = await this.commentRepository.findOne({ where: { id } });
        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다.');
        }
        return comment;
    }

    private async verifyCardId(cardId: number): Promise<CardsModel> {
        const card = await this.cardsRepository.findOne({ where: { id: cardId } });
        if (!card) {
            throw new NotFoundException('카드를 찾을 수 없습니다.');
        }
        return card;
    }

    async getAllCommentsByCardId(cardId: number) {
        await this.verifyCardId(cardId);
        const comments = await this.commentRepository.find({ where: { cardId } });
        return comments;
    }

    async createComment(userId: number, cardId: number, createCommentDto: CreateCommentDto) {
        const comment = this.commentRepository.create({ userId, cardId, ...createCommentDto });
        return this.commentRepository.save(comment);
    }

    async getCommentById(id: number) {
        const foundComment = await this.commentRepository.findOne({ where: { id } });
        return foundComment;
    }

    async updateComment(id: number, updatedComment: CommentsModel) {
        await this.verifyCommentId(id);
        await this.commentRepository.update(id, updatedComment);
        return this.verifyCommentId(id);
    }

    async deleteComment(id: number) {
        await this.verifyCommentId(id);
        const result = await this.commentRepository.delete(id);
    }
}
