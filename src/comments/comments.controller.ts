import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentsModel } from './entities/comments.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get(':cardId')
    async getAllCommentsByCardId(@Param('cardId') cardId: number) {
        return this.commentsService.getAllCommentsByCardId(cardId);
    }

    @UseGuards(AccessTokenGuard)
    @Post(':cardId')
    async createComment(
        @Request() req,
        @Param('cardId') cardId: number,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        const userId = req.userId;
        const comment = await this.commentsService.createComment(userId, cardId, createCommentDto);

        return {
            statusCode: HttpStatus.CREATED,
            message: '댓글이 등록되었습니다.',
            comment,
        };
    }

    @UseGuards(AccessTokenGuard)
    @Put(':cardId/:id')
    async updateComment(
        @Request() req,
        @Param('id') id: number,
        @Param('cardId') cardId: number,
        @Body()
        updatedComment: CommentsModel,
    ) {
        const comment = await this.commentsService.updateComment(id, cardId, updatedComment);
        if (comment.userId !== req.userId) {
            throw new ForbiddenException('권한이 없습니다.');
        }

        return {
            statusCode: HttpStatus.OK,
            message: '댓글이 수정되었습니다.',
            comment,
        };
    }

    @UseGuards(AccessTokenGuard)
    @Delete(':cardId/:id')
    async deleteComment(@Request() req, @Param('id') id: number, @Param('cardId') cardId: number) {
        const comment = await this.commentsService.getCommentById(id);
        if ((comment as CommentsModel)?.userId !== req.userId) {
            throw new ForbiddenException('권한이 없습니다.');
        }

        await this.commentsService.deleteComment(id, cardId);
        return {
            statusCode: HttpStatus.OK,
            message: '댓글이 삭제되었습니다.',
        };
    }
}
