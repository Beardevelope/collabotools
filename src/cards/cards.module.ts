import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsModel } from './entities/cards.entity';
import { ListsModule } from 'src/lists/lists.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CardsModel]),
        ListsModule,
        UsersModule,
        AuthModule,
        CommentsModule,
    ],
    controllers: [CardsController],
    providers: [CardsService],
})
export class CardsModule {}
