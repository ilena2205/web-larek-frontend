import {IBasket, ICard} from "../types";
import {IEvents} from "./base/events";


export class BasketData implements IBasket {
    protected _chosencards: ICard[] = [];
    protected _cardIds: string[] = []; 
    protected events: IEvents;

    constructor(events:IEvents) {
        this.events = events;
    }

    set chosencards(chosencards: ICard[]) {
        this._chosencards = chosencards;
        this._cardIds = chosencards.map(card => card.id); 
        this.events.emit('chosenCards:changed')
    }

    get chosencards() {
        return this._chosencards;
    }

    get cardIds() {
        return this._cardIds;
    }

    getTotal() {
        return this._chosencards.reduce((total, card) => {
            // Если у карты есть цена, прибавляем её, иначе прибавляем 0
            return total + (card.price || 0);
        }, 0);
    }

    addCard(card: ICard) {
        this._chosencards = [card, ...this._chosencards];
        this._cardIds = [card.id, ...this._cardIds];
        this.events.emit('chosenCards:changed');
    }

    clearBasket()  {
        this._chosencards = [];
        this._cardIds = [];
        this.events.emit('chosenCards:clear')
    }
    
    deleteCard(cardId: string, payload: Function | null) {
        this._chosencards = this._chosencards.filter(card => card.id !== cardId);
        this._cardIds = this._cardIds.filter(id => id !== cardId);
        if (payload) {
            payload();
        } else {
            this.events.emit('chosenCards:changed');
        }
    }
}