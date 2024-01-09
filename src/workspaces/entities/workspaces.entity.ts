import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { ListsModel } from 'src/lists/entities/lists.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class WorkspacesModel extends BaseModel {
    @Column()
    @IsString()
    name: string;

    @Column()
    @IsString()
    description: string;

    @Column()
    @IsString()
    color: string;

    /**
     * admin
     */
    @ManyToOne(() => UsersModel, (user) => user.myWorkspaces)
    owner: UsersModel;

    /**
     * 멤버
     */
    @ManyToMany(() => UsersModel, (user) => user.workspaces)
    users: UsersModel;

    /**
     * 리스트
     */
    @OneToMany(() => ListsModel, (list) => list.workspace,{
        onDelete:'CASCADE'
    })
    lists: ListsModel[];
}
