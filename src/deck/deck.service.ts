import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Deck } from './schemas/deck.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class DeckService {

    constructor(
      @InjectModel(Deck.name)
      private deckModel: mongoose.Model<Deck>  
    ) {}

    async fetchCommander(commanderName: string): Promise<any> {
      const url = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(commanderName)}`;
      console.log(`Fetching commander from URL: ${url}`);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Response from Scryfall API:', data);
      return data;
  }


  async fetchCardsByColors(colors: string[]): Promise<string[]> {
    const colorQuery = colors.join(',');
    const response = await fetch(`https://api.scryfall.com/cards/search?q=color%3D${colorQuery}&unique=cards&order=random`);
    const data = await response.json();

    const cards: string[] = [];

    for (const card of data.data) {
        // Verifica se é um terreno básico
        if (card.type_line.includes('Basic Land')) {
            // Terrenos básicos podem ser repetidos
            cards.push(card.name);
            if (cards.length === 99) break;
            continue;
        }

        // Verifica se a carta permite múltiplas cópias
        const isRepeatable = card.oracle_text && card.oracle_text.includes('A deck can have any number of cards named');
        if (!isRepeatable && cards.includes(card.name)) continue;

        // Adiciona a carta ao deck
        cards.push(card.name);
        if (cards.length === 99) break;
    }

    return cards;
   }


   async createDeckWithCommander(commanderName: string, deckName: string): Promise<Deck> {
    // Buscar o comandante
    const commander = await this.fetchCommander(commanderName);

    if (!commander) {
        throw new NotFoundException('Comandante não encontrado');
    }

    // Extrair as cores do comandante
    const commanderColors = commander.colors;

    // Buscar 99 cartas com base nas cores do comandante
    const cards = await this.fetchCardsByColors(commanderColors);

    // Criar o deck
    const deck = new this.deckModel({
        name: deckName,
        commanderName: commander.name,
        colors: commanderColors,
        cards: cards
    });

    return deck.save();
   }

   ////////////////////////////////////////////////////////////////////////////////

    async findAll(): Promise<Deck[]> {
        const decks = await this.deckModel.find();
        return decks;
    }

    async create(deck: Deck): Promise<Deck> {
      const res = await this.deckModel.create(deck);
      return res;
    }

    async findById(id: string): Promise<Deck> {
      const deck = await this.deckModel.findById(id);

      if(!deck){
        throw new NotFoundException('O deck não foi encontrado');
      }

      return deck;
    }

    async updateById(id: string, deck: Deck): Promise<Deck> {
      return await this.deckModel.findByIdAndUpdate(id, deck, {
         new: true,
         runValidators: true,
      });
    }

    async deleteById(id: string): Promise<Deck> {
        return await this.deckModel.findByIdAndDelete(id);
    }

  
}
