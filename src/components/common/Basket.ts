import { IBasketView, ICard } from "../../types";
import { createElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";



export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this._list = this.container.querySelector('.basket__list');
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set selected(items: ICard[]) {
        if (items.length) {
            this.setDisabled(this._button, false);  // Активируем кнопку, если товары есть
        } else {
            this.setDisabled(this._button, true);   // Деактивируем кнопку, если товаров нет
        }
    }
    
    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}