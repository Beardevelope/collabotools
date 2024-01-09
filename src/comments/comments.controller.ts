import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentsModel } from './entities/comments.entity';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get(':cardId')
    async getAllCommentsByCardId(@Param('cardId') cardId: number) {
        return this.commentsService.getAllCommentsByCardId(cardId);
    }

    @Post(':cardId')
    async createComment(
        @Request() req,
        @Param('cardId') cardId: number,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        const userId = req.user.id;
        const comment = await this.commentsService.createComment(userId, createCommentDto);

        return {
            statusCode: HttpStatus.CREATED,
            message: '댓글이 등록되었습니다.',
            comment,
        };
    }

    @Put(':id')
    async updateComment(@Param('id') id: number, @Body() updatedComment: CommentsModel) {
        const comment = await this.commentsService.updateComment(id, updatedComment);
        return {
            statusCode: HttpStatus.OK,
            message: '댓글이 수정되었습니다.',
            comment,
        };
    }

    @Delete(':id')
    async deleteComment(@Param('id') id: number): Promise<void> {
        await this.commentsService.deleteComment(id);
    }
}
