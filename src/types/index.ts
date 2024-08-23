// Типизация данных
export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface ICustomer {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface ICards {
    cards: ICard[];
    preview: string | null;
    getCard(cardId:string):ICard;
}

export interface IBasket {
    chosencards: ICard[];
    addCard(card:ICard): void;
    deleteCard(cardId:string, payload: Function | null):void;
    clearBasket():void;
}

export interface ICustomerInfo {
    payment: TCustomerInfoPayment;
    contacts: TCustomerInfoContacts;
    checkValidation(data: Record<keyof TCustomerInfoPayment,  string> | Record<keyof TCustomerInfoContacts, string>):boolean;
    setPaymentInfo(paymentData: TCustomerInfoPayment): void;
    setContactInfo(contactData: TCustomerInfoContacts): void;
    clearData():void;
}

export type TCardInfo = Pick<ICard, 'title' | 'image' | 'category' | 'price'>;
export type TCardInfoFull = Pick<ICard, 'title' | 'image' | 'category' | 'price' | 'description'>;
export type TCardInfoShort = Pick<ICard, 'title' | 'price'>;
export type TCustomerInfoPayment = Pick<ICustomer, 'payment' | 'address'>;
export type TCustomerInfoContacts = Pick<ICustomer, 'email' | 'phone'>;




