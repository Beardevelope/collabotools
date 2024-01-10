import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsModel } from './entities/cards.entity';
import { ListsModule } from 'src/lists/lists.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([CardsModel]), ListsModule, UsersModule, AuthModule],
    controllers: [CardsController],
    providers: [CardsService],
})
export class CardsModule {}
