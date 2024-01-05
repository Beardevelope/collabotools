import { IsString } from 'class-validator';
import { CardsModel } from 'src/cards/entities/cards.entity';
import { CommentsModel } from 'src/comments/entities/comments.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import { WorkspacesModel } from 'src/workspaces/entities/workspaces.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class UsersModel extends BaseModel {
    @Column()
    @IsString()
    email: string;

    @Column()
    @IsString()
    password: string;

    @Column()
    @IsString()
    name: string;

    /**
     * 내가 생성한 워크스페이스
     */
    @OneToMany(() => WorkspacesModel, (workspace) => workspace.owner)
    myWorkspaces: WorkspacesModel[];

    /**
     * 멤버
     */
    @ManyToMany(() => WorkspacesModel, (workspace) => workspace.users)
    @JoinTable()
    workspaces: WorkspacesModel;

    /**
     * 카드
     */
    @OneToMany(() => CardsModel, (card) => card.user)
    cards: CardsModel[];

    /**
     * 덧글 목록
     */
    @OneToMany(() => CommentsModel, (comment) => comment.user)
    comments: CommentsModel[];

    /**
     * 할일배정
     */
    @ManyToMany(() => CardsModel, (card) => card.workers)
    @JoinTable()
    works: CardsModel[];
}