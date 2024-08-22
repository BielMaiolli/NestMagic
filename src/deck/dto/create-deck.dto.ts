import { Colors } from "../schemas/deck.schema";


export class createDeckDto {
    readonly name: string;
    readonly commanderName: string;
    readonly cards: string[];
    readonly colors: Colors[];
}