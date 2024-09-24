import { Api, ApiListResponse } from './base/api';
import {ICard, ICustomer, IOrderResult} from "../types";
import { IOrder } from './CustomerInfoData';


export interface IProductAPI {
    getCards: () => Promise<ICard[]>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class ProductsAPI extends Api implements IProductAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCards(): Promise<ICard[]> {
        return this.get('/product').then((data: ApiListResponse<ICard>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }
    
    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}


