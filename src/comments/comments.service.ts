import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsModel } from './entities/comments.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentsModel)
        private readonly commentRepository: Repository<CommentsModel>,
    ) {}

    async getAllCommentsByCardId(cardId: number) {
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
        await this.getCommentById(id);
        await this.commentRepository.update(id, updatedComment);
        return this.getCommentById(id);
    }

    async deleteComment(id: number) {
        const result = await this.commentRepository.delete(id);
        return { message: '댓글이 삭제되었습니다.' };
    }
}
