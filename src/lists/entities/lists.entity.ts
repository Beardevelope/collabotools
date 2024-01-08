import { IsNumber, IsString } from 'class-validator';
import { CardsModel } from 'src/cards/entities/cards.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import { WorkspacesModel } from 'src/workspaces/entities/workspaces.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class ListsModel extends BaseModel {
    @Column()
    @IsString()
    title: string;

    @Column({
        default: 1,
    })
    @IsNumber()
    order: number;

    /**
     * 워크스페이스
     */
    @ManyToOne(() => WorkspacesModel, (workspace) => workspace.lists)
    workspace: WorkspacesModel;

    @OneToMany(() => CardsModel, (cards) => cards.list)
    cards: CardsModel[];
}
