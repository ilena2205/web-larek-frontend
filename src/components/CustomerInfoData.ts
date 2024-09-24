import { IEvents } from './base/events';

export interface IOrderForm {
    email: string;
    phone: string;
	payment: string;
	address: string;
}

export interface IOrder extends IOrderForm {
    items: string[],
	total: number
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export class CustomerInfoData {
    order: IOrder = {
        email: '',
        phone: '',
		address: '',
		payment: '',
        items: [],
		total: 0,
    };
	formErrors: FormErrors = {};
    protected events: IEvents;

    constructor(events: IEvents) {
		this.events = events;
	}

    getCustomerInfo(): IOrderForm {
		return { payment: this.order.payment, email: this.order.email, phone: this.order.phone, address: this.order.address };
	}

    setInfo(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    };

    clearData()  {
        this.order.payment = '';
        this.order.address = '';
        this.order.email = '';
        this.order.phone = '';
        this.events.emit('customerData:clear')
    }

	validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this.order.address) {
            errors.address= 'Необходимо указать адрес';
        }
		if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
		if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}
