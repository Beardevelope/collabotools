import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ListsModule } from './lists/lists.module';
import { CardsModule } from './cards/cards.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './users/entities/users.entity';
import { WorkspacesModel } from './workspaces/entities/workspaces.entity';
import { ListsModel } from './lists/entities/lists.entity';
import { CardsModel } from './cards/entities/cards.entity';
import { CommentsModel } from './comments/entities/comments.entity';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        WorkspacesModule,
        ListsModule,
        CardsModule,
        CommentsModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'express-database.cvl4c0czszhc.ap-northeast-2.rds.amazonaws.com',
            port: 3306,
            username: 'root',
            password: '1q2w3e4r',
            database: 'trello-api',
            entities: [UsersModel, WorkspacesModel, ListsModel, CardsModel, CommentsModel],
            synchronize: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
