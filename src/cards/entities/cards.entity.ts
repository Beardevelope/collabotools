import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { ListsModel } from 'src/lists/entities/lists.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class CardsModel extends BaseModel {
    @Column()
    @IsString()
    title: string;

    @Column()
    @IsString()
    description: string;

    @Column()
    order: string;

    @Column()
    @IsString()
    color: string;

    /**
     * 리스트
     */
    @ManyToOne(() => ListsModel, (list) => list.cards, { onDelete: 'CASCADE' })
    list: ListsModel;

    /**
     * 카드 등록자
     */
    @ManyToOne(() => UsersModel, (user) => user.cards)
    user: UsersModel;

    @ManyToMany(() => UsersModel, (user) => user.works, {
        eager: true,
    })
    workers: UsersModel[];
}
