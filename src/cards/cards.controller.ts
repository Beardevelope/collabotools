import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Post()
    async createCard(@Body() createCardDto: CreateCardDto) {
        const userId = 1;
        const listId = 31;

        return await this.cardsService.createCards(createCardDto, userId, listId);
    }

    @Get(':listId')
    async getAllCards(@Param('listId', ParseIntPipe) listId: number) {
        return await this.cardsService.getAllcards(listId);
    }

    @Get(':listId/:id')
    async findOneById(@Param('id', ParseIntPipe) id: number) {
        return await this.cardsService.findOneById(id);
    }

    @Patch(':listId/:id')
    async updateCard(@Param('id', ParseIntPipe) id: number, @Body() updateCardDto: UpdateCardDto) {
        return await this.cardsService.updateCard(id, updateCardDto);
    }

    @Delete(':listId/:id')
    async deleteCard(@Param('id', ParseIntPipe) id: number) {
        return await this.cardsService.deleteCard(id);
    }
}
