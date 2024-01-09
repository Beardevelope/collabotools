import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class CommentsModel extends BaseModel {
    @Column()
    @IsString()
    content: string;

    /**
     * 덧글 생성자
     */
    @ManyToOne(() => UsersModel, (user) => user.comments)
    user: UsersModel;
}
