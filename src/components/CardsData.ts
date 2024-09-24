import {ICards, ICard} from "../types";
import {IEvents} from "./base/events";


export class CardsData implements ICards {
    protected _cards: ICard[];
    protected _preview: string | null;
    protected events: IEvents;

    constructor(events:IEvents) {
        this.events = events;
    }

    set cards(cards: ICard[]) {
        this._cards = cards;
        this.events.emit('cards:changed')
    }

    get cards() {
        return this._cards;
    }

    get preview () {
        return this._preview;
    }

    set preview(cardId: string | null) {
        if (!cardId) {
            this._preview = null;
            this.events.emit('card:previewClear')
            return;
        }
        const selectedCard = this.getCard(cardId);
        if (selectedCard) {
            this._preview = cardId;
            this.events.emit('card:selected')
        }
    }

    getCard(cardId: string) {
        return this._cards.find((item) => item.id === cardId)
    }
}