import './scss/styles.scss';

import { ProductsAPI } from './components/ProductsAPI';
import { API_URL, CDN_URL} from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';

import { BasketData } from './components/BasketData';
import { CustomerInfoData, IOrderForm } from './components/CustomerInfoData';
import { CardsData } from './components/CardsData';

import { Basket } from './components/common/Basket';
import { Form } from './components/common/Form';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { Contacts } from './components/Contacts';
import { Order } from './components/Order';
import { ICard} from './types';

const events = new EventEmitter();
const api = new ProductsAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const cardsData = new CardsData(events);
const basketData = new BasketData(events);
const customerInfoData = new CustomerInfoData(events);

// Глобальные контейнеры
const page = new Page(document.querySelector('.page'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Получаем карточки с сервера
api.getCards()
    .then((cardsList) => {
        cardsData.cards = cardsList;
})
    .catch((err) => {
        console.error(err)
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Изменились элементы каталога
events.on('cards:changed', () => {
    const cardsArray = cardsData.cards.map(card => {
        const cardInstant = new Card(cloneTemplate(cardCatalogTemplate), 
        {onClick: () => events.emit('card:selected', card)});
        return cardInstant.render(card);
    });

    page.render({catalog:cardsArray});
});

// Открыть карточку товара
events.on('card:selected', (item: ICard) => {
    cardsData.preview;
    const isInBasket = basketData.chosencards.some(card => card.id === item.id);
    const isPriceZero = item.price === null;

    const previewCard = new Card(cloneTemplate(cardPreviewTemplate), 
    {onClick: () => {
        if (!isInBasket && !isPriceZero) {
            events.emit('card:add', item);
        }
    }});

    modal.render({
        content: previewCard.render(item, isInBasket || isPriceZero)
});
});

// Товар добавлен в корзину
events.on('card:add', (item: ICard) => {
    const addButton = document.querySelector('.card__button');
    if (addButton) {
        addButton.setAttribute('disabled', 'disabled');
        addButton.textContent = 'Невозможно купить';
    };
    basketData.addCard(item);
    page.counter = basketData.chosencards.length;
});

// Функция для рендеринга корзины
function renderBasket() {
    const basketArray = basketData.chosencards.map((card, index) => {
        const cardBasketInstant = new Card(cloneTemplate(cardBasketTemplate), 
        {onClick: () => events.emit('card:delete', card)});
        return cardBasketInstant.render(card, false, index + 1);
    });

    modal.render({
        content: basket.render({items: basketArray}),
    });

    basket.total = basketData.getTotal(); 
    basket.selected = basketData.chosencards;
}

// Открыть корзину
events.on('basket:open', () => {
    renderBasket();
});

// Удалить товар из корзины
events.on('card:delete', (item: ICard) => {
    basketData.deleteCard(item.id, null);
    page.counter = basketData.chosencards.length; 
    renderBasket(); 
});

// Открыть окно оформления заказа оплаты и адреса
events.on('order:open', () => {
    modal.render({
        content: order.render({valid: false, errors: []})
    })
    customerInfoData.order.items = basketData.cardIds;
    customerInfoData.order.total = basketData.getTotal();
});

// Открыть окно оформления заказа email и телефон
events.on('order:submit', () => {
    modal.render({
        content: contacts.render({valid: false, errors: []})
    })
});

// Изменилось одно из полей окна оформления заказа оплаты и адреса
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    customerInfoData.setInfo(data.field, data.value);
});

// Изменилось одно из полей окна оформления заказа email и телефон
events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    customerInfoData.setInfo(data.field, data.value);
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { payment, address, email, phone } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
    api.orderProducts(customerInfoData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                }
            });
            
            success.total = basketData.getTotal();
            basketData.clearBasket();
            customerInfoData.clearData();
            page.counter = basketData.chosencards.length;

            modal.render({
                content: success.render({})
            });
        })
        .catch(err => {
            console.error(err);
        });
})







