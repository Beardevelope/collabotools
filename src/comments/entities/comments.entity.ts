import { IsNotEmpty, IsString } from 'class-validator';
import { CardsModel } from 'src/cards/entities/cards.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';

@Entity('comments')
export class CommentsModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    cardId: number;

    @IsNotEmpty({ message: '댓글 내용을 입력해주세요.' })
    @IsString()
    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * 덧글 생성자
     */
    @ManyToOne(() => UsersModel, (user) => user.comments, { onDelete: 'CASCADE' })
    user: UsersModel;

    @ManyToOne(() => CardsModel, (card) => card.comments, { onDelete: 'CASCADE' })
    card: CardsModel;
}
