// validation.js

/**
 * Валидаторы для полей формы.
 * @property {function(string): string|null} username - Валидатор для имени пользователя.
 * @property {function(string): string|null} email - Валидатор для электронной почты.
 * @property {function(string): string|null} phone - Валидатор для телефона.
 * @property {function(string): string|null} password - Валидатор для пароля.
 * @property {function(string): string|null} passwordAgain - Валидатор для подтверждения пароля.
 */
const validators = {
	/**
	 * Валидатор для имени пользователя.
	 * @param {string} value - Значение поля.
	 * @returns {string|null} - Сообщение об ошибке или null, если валидация прошла успешно.
	 */
	username: (value) => {
		if (!value) return 'Имя пользователя обязательно';
		const regexText = /^[^!>?<_\-$№#@]+$/;
		if (!regexText.test(value))
			return 'Имя пользователя не должно содержать !>?<_-$№#@ символы';
		return null;
	},

	/**
	 * Валидатор для электронной почты.
	 * @param {string} value - Значение поля.
	 * @returns {string|null} - Сообщение об ошибке или null, если валидация прошла успешно.
	 */
	email: (value) => {
		if (!value) return 'Электронная почта обязательна';
		if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
			return 'Некорректный формат электронной почты';
		return null;
	},

	/**
	 * Валидатор для телефона.
	 * @param {string} value - Значение поля.
	 * @returns {string|null} - Сообщение об ошибке или null, если валидация прошла успешно.
	 */
	phone: (value) => {
		if (!value) return 'Телефон обязателен';
		if (!/^\+?[0-9-]+$/.test(value)) return 'Некорректный номер телефона';
		return null;
	},

	/**
	 * Валидатор для пароля.
	 * @param {string} value - Значение поля.
	 * @returns {string|null} - Сообщение об ошибке или null, если валидация прошла успешно.
	 */
	password: (value) => {
		if (!value) return 'Пароль обязателен';
		if (value.length < 5) return 'Пароль должен быть не менее 5 символов';
		return null;
	},

	/**
	 * Валидатор для подтверждения пароля.
	 * @param {string} value - Значение поля.
	 * @param {string} originalPassword - Оригинальный пароль для сравнения.
	 * @returns {string|null} - Сообщение об ошибке или null, если валидация прошла успешно.
	 */
	passwordAgain: (value, originalPassword) => {
		if (!value) return 'Повторите пароль';
		if (value !== originalPassword) return 'Пароли не совпадают';
		return null;
	},
};

/**
 * Функция для валидации формы на основе предоставленных валидаторов.
 *
 * @param {Object} formData - Данные формы, представленные в виде объекта.
 * @returns {Object} - Объект с сообщениями об ошибках для каждого поля формы.
 */
export function validateForm(formData) {
	// Объект для хранения сообщений об ошибках
	const validationErrors = {};

	// Итерация по каждому полю формы
	Object.entries(formData).forEach(([field, value]) => {
		// Получение валидатора для текущего типа поля
		const validator = validators[field];

		// Если валидатор существует, выполняем проверку
		if (validator) {
			// Для пароля и подтверждения пароля передаем оригинальный пароль
			const errorMessage =
				field === 'passwordAgain'
					? validator(value, formData.password)
					: validator(value);

			// Если есть сообщение об ошибке, добавляем его в объект ошибок
			if (errorMessage) {
				validationErrors[field] = errorMessage;
			}
		}
	});

	// Возвращаем объект с сообщениями об ошибках
	return validationErrors;
}
