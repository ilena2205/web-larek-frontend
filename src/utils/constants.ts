export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

export const constraintsContacts = {
	email: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
	},
    phone: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
  }
};

export const constraintsPayment = {
	address: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
	},
}

