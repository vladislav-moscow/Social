/**
 * Валидация данных формы регистрации.
 * @param {Object} values - Объект с полями формы регистрации.
 * @param {string} values.username - Имя пользователя.
 * @param {string} values.email - Адрес электронной почты.
 * @param {string} values.password - Пароль пользователя.
 * @param {string} values.passwordAgain - Подтверждение пароля.
 * @returns {Object} Объект с ошибками, если они найдены.
 */
export const validateRegisterForm = (values) => {
	const errors = {};

	// Проверка имени пользователя
	if (!values.username) {
		errors.username = 'Имя пользователя не должно быть пустым';
	}

	// Проверка email
	if (!values.email) {
		errors.email = 'Адрес электронной почты не должен быть пустым';
	} else if (!/\S+@\S+\.\S+/.test(values.email)) {
		errors.email = 'Некорректный адрес электронной почты';
	}

	// Проверка пароля
	if (!values.password) {
		errors.password = 'Пароль не должен быть пустым';
	} else if (values.password.length < 6) {
		errors.password = 'Пароль должен содержать не менее 6 символов';
	}

	// Проверка повторного ввода пароля
	if (values.passwordAgain !== values.password) {
		errors.passwordAgain = 'Пароли не совпадают';
	}

	return errors;
};

/**
 * Валидация данных формы входа.
 * @param {Object} values - Объект с полями формы входа.
 * @param {string} values.email - Адрес электронной почты.
 * @param {string} values.password - Пароль пользователя.
 * @returns {Object} Объект с ошибками, если они найдены.
 */
export const validateLoginForm = (values) => {
	const errors = {};

	// Проверка email
	if (!values.email) {
		errors.email = 'Адрес электронной почты не должен быть пустым';
	} else if (!/\S+@\S+\.\S+/.test(values.email)) {
		errors.email = 'Некорректный адрес электронной почты';
	}

	// Проверка пароля
	if (!values.password) {
		errors.password = 'Пароль не должен быть пустым';
	} else if (values.password.length < 5) {
		errors.password = 'Пароль должен содержать не менее 5 символов';
	}

	return errors;
};
