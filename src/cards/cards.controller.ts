import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Post()
    async createCard(@Body() createCardDto: CreateCardDto) {
        const userId = 1;
        const listId = 31;

        return await this.cardsService.createCards(createCardDto, userId, listId);
    }

    @Post(':cardId/users')
    @UseGuards(AccessTokenGuard)
    addUserToCard(@Param('cardId') cardId: number, @Req() req: Request) {
        console.log(cardId);
        /**
         * 1) 현재 로그인한 회원이 현재 워크스페이스에 해당하는지 확인해야하고
         */
        return this.cardsService.addUserToCard(+cardId, req['userId']);
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

    @Patch(':listId/cards/:cardId')
    async updateCardOrder(
        @Param('listId', ParseIntPipe) listId: number,
        @Param('cardId', ParseIntPipe) cardId: number,
        @Body('rankId') rankId: string,
    ) {
        console.log(rankId);
        return await this.cardsService.updateCardOrder(listId, cardId, rankId);
    }
}
