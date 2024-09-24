import {Form} from "./common/Form";
import {TCustomerInfoPayment} from "../types";
import {IEvents} from "./base/events";

export class Order extends Form<TCustomerInfoPayment> {
    
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.initializePaymentButtons();
    }

    private initializePaymentButtons() {
        const paymentButtons = this.container.querySelectorAll<HTMLButtonElement>('.button_alt');
        
        paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.getAttribute('data-value');
                this.onInputChange(button.name as keyof TCustomerInfoPayment, value);
            });
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

}