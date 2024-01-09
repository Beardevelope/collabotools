import { PickType } from '@nestjs/mapped-types';
import { CommentsModel } from '../entities/comments.entity';

export class CreateCommentDto extends PickType(CommentsModel, ['content']) {}
// export class CreateCommentDto {
//     content: string;
// }
