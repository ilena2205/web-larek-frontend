// Типизация данных
export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    index?: number;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: ICard[];
}

export interface IBasket {
    chosencards: ICard[];
    cardIds: string[];
    addCard(card:ICard): void;
    deleteCard(cardId:string, payload: Function | null):void;
    clearBasket():void;
}

export interface ICards {
    cards: ICard[];
    preview: string | null;
    getCard(cardId:string):ICard | undefined;
}

export interface ICustomer {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
}

export type TCustomerInfoContacts = Pick<ICustomer, 'email' | 'phone'>;
export type TCustomerInfoPayment = Pick<ICustomer, 'payment' | 'address'>;











