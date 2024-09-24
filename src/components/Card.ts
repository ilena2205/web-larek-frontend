import { ICard } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
    protected events: IEvents;
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;
   
    protected cardIndex?: HTMLElement;
    protected cardImage?: HTMLImageElement;
    protected cardCategory?: HTMLElement;
    protected cardText?: HTMLElement;  
    protected cardPageButton?: HTMLButtonElement; 
    protected cardModalButton?: HTMLButtonElement;  
    protected cardId: string;
    protected inCart: boolean;

    constructor(container: HTMLTemplateElement, actions?: ICardActions) {
        super(container); // Передача корневого элемента в базовый класс

        // Общие элементы для всех шаблонов
        this.cardTitle = this.container.querySelector('.card__title');
        this.cardPrice = this.container.querySelector('.card__price');

        // Проверяем наличие элементов для каждого шаблона
        this.cardIndex = this.container.querySelector('.basket__item-index');
        this.cardCategory = this.container.querySelector('.card__category');
        this.cardImage = this.container.querySelector('.card__image');
        this.cardText = this.container.querySelector('.card__text');
        this.cardPageButton = this.container.querySelector('.gallery__item');
        this.cardModalButton = this.container.querySelector('.card__button');

        if (actions?.onClick) {
            if (this.cardPageButton) {
                this.cardPageButton.addEventListener('click', actions.onClick);
            } 
            else if (this.cardModalButton) {
                this.cardModalButton.addEventListener('click', actions.onClick);
            }
            else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    updateButtonState() {
        if (this.inCart && this.cardModalButton) {
            this.setDisabled(this.cardModalButton, true);
            this.setText(this.cardModalButton, 'Невозможно купить');
        }
    }

    render(cardData: Partial<ICard>, inCart: boolean = false, index: number = 0, isPriceZero: boolean = false): HTMLElement {
        this.inCart = inCart;
        this.updateButtonState();
        const {...otherCardData} = cardData;
        if (this.cardIndex) {
            this.index = index;
        }
        return super.render(otherCardData);
    }

    set title(title: string) {
        this.setText(this.cardTitle, title);
    }

    set index(index:number) {
        if (this.cardIndex) {
            this.setText(this.cardIndex, `${index}`);
        }
    }
    
    get title(): string {
        return this.cardTitle.textContent;
    }

    set price(price: number | null) {
        this.setText(this.cardPrice, `${price} синапсов`);
    }
    
    set description(description: string) {
        if (this.cardText) {
            this.setText(this.cardText, description);
        }
    }
    
    set category(category: string) {
        if (this.cardCategory) {
            // Удаляем старые классы категорий
            this.cardCategory.classList.remove('card__category_soft', 'card__category_hard', 'card__category_other', 'card__category_additional', 'card__category_button');
            
            // Присваиваем новый класс в зависимости от категории
            switch (category) {
                case 'софт-скил':
                    this.cardCategory.classList.add('card__category_soft');
                    break;
                case 'хард-скил':
                    this.cardCategory.classList.add('card__category_hard');
                    break;
                case 'другое':
                    this.cardCategory.classList.add('card__category_other');
                    break;
                case 'дополнительное':
                    this.cardCategory.classList.add('card__category_additional');
                    break;
                case 'кнопка':
                    this.cardCategory.classList.add('card__category_button');
                    break;
                default:
                    // По умолчанию, если категория не подходит под известные классы
                    this.cardCategory.classList.add('card__category_other');
                    break;
            }

            // Обновляем текст категории
            this.setText(this.cardCategory, category);
        }
    }
    
    set image(image: string) {
        if (this.cardImage) {
            this.setImage(this.cardImage, image);
        }
    }

    set id(id: string) {
        this.cardId = id;
    }

    get id() {
        return this.cardId;
    }

    deleteCard() {
        this.container.remove();
    }
}