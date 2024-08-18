import { validateForm } from "../utils/validators";
import { useState } from "react";

/**
 * Хук для управления обработки, обновления и отправки данных формы.
 *
 * @param {Object} initialValues - Начальное состояние формы (Объект).
 * @returns {formValues} - Объект с состоянием формы.
 * @returns {handleInputChange} - Функция обработчик при смене данных в инпуте.
 * @returns {resetForm} - Функция сброса состояния формы.
 */
export function useForm(initialValues) {
  // Состояние формы, хранит значения полей
  const [formValues, setFormValues] = useState(initialValues);

  // Состояние для отслеживания ошибок валидации
  const [formErrors, setFormErrors] = useState({});

  /**
   * Обработчик изменения значения полей формы.
   *
   * @param {Object} e - Событие изменения.
   */
  const handleInput = (e) => {
    const { name, value, type } = e.target;

    // Обновляем состояние формы для текущего поля
    const updatedFormState = { ...formValues, [name]: value };
    setFormValues(updatedFormState);

    // Валидируем текущее поле по атрибуту type
    const validationErrors = {
      ...formErrors,
      [name]: validateForm({ [type]: value })[type] || null,
    };

    // Обновляем состояние ошибок
    setFormErrors(validationErrors);
  };

  // Функция для сброса состояния формы и состояния ошибок
  const resetForm = () => {
    setFormValues(initialValues);
    setFormErrors({});
  };

  return {
    formValues,
    formErrors,
    handleInput,
    resetForm,
  };
}

export default useForm;
