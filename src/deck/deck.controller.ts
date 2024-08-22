import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { DeckService } from './deck.service';
import { Deck } from './schemas/deck.schema';
import { createDeckDto } from './dto/create-deck.dto';
import { updateDeckDto } from './dto/update-deck.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('deck')
export class DeckController {

    
constructor(private deckService: DeckService) {}

  @Get('commander')
   async getCommander(@Query('name') name: string): Promise<any> {
    if (!name) {
        throw new Error('Missing "name" query parameter');
    }
    return this.deckService.fetchCommander(name);
   }

  
   @Post('newDeckWithCommander')
   @UseGuards(AuthGuard())
   async createDeckWithCommander(
       @Query('commanderName') commanderName: string,
       @Query('deckName') deckName: string,
   ): Promise<Deck> {
       return this.deckService.createDeckWithCommander(commanderName, deckName);
   }

   //////////////////////////////////////////////////////////////////////

  @Get('allDecks')
  async getAllDecks(): Promise<Deck[]> {
    return this.deckService.findAll()
  }

  @Post('newDeckManual')
  @UseGuards(AuthGuard())
  async createDeck(
    @Body()
    deck: createDeckDto,
  ): Promise<Deck> {
    return this.deckService.create(deck)
  }

  @Get(':id')
  async getById(
    @Param('id')
    id: string,
  ): Promise<Deck> {
    return this.deckService.findById(id);
  }

  @Put('/updateDeck/:id')
  @UseGuards(AuthGuard())
  async updateDeck(
    @Param('id')
    id: string,
    @Body()
    deck: updateDeckDto,
  ): Promise<Deck> {
    return this.deckService.updateById(id, deck);
  }

  @Delete('/deleteDeck/:id')
  @UseGuards(AuthGuard())
  async deleteById(
    @Param('id')
    id: string,
  ): Promise<Deck> {
    return this.deckService.deleteById(id);
  }


}

