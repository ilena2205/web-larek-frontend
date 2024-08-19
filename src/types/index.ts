// формируем тип данных из АПИ
export interface ICardProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: string;
}

export interface ICustomerData {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

//формиируем интерфейс для АПИ клиента
export interface OrderResult {
    status: string;
    message: string;
}

//формируем тип данных для модели данных
export interface IListOfCards {
    products: ICardProduct[];
    selectedProduct: ICardProduct;
    getProducts: () => Promise<ICardProduct[]>;
}

export interface IShoppingList {
    chosenProducts: ICardProduct[];
    addProduct: (selectedProduct: ICardProduct) => void;
    deleteProduct: (selectedProduct: ICardProduct) => void;
    orderProducts: () => Promise<ICustomerData[]>;
    ClearAll: () => void;
}

export interface ICustomerData {
    orderResutl: (order: ICustomerData) => Promise<OrderResult[]>;
}

// формируем тип данных для отображения
export interface Card {
    description: string;
    image: string;
    title: string;
    category: string;
    price: string;
    cardText: string;
    cardImage: string;
    cardTitle: string;
    cardCategory: string;
    cardPrice: string;
    compactClass: string;
}

export interface Form {
    payment: string;
    email: string;
    phone: string;
    address: string;
    formPayment: string;
    formEmail: string;
    formPhone: string;
    formAaddress: string;
}
