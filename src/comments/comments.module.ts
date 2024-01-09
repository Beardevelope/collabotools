import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsModel } from 'src/cards/entities/cards.entity';
import { CommentsModel } from './entities/comments.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([CardsModel, CommentsModel]), AuthModule, CardsModel],
    controllers: [CommentsController],
    providers: [CommentsService],
})
export class CommentsModule {}
