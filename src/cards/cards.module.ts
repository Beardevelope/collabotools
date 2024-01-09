import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsModel } from './entities/cards.entity';
import { ListsModule } from 'src/lists/lists.module';

@Module({
    imports: [TypeOrmModule.forFeature([CardsModel]), ListsModule],
    controllers: [CardsController],
    providers: [CardsService],
})
export class CardsModule {}
