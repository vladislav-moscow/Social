const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

export const validateFile = (file) => {
  if (!file) return 'Файл не выбран';
  if (!ALLOWED_FILE_TYPES.includes(file.type)) return 'Неверный формат файла';
  if (file.size > MAX_FILE_SIZE) return 'Файл слишком большой';
  return null;
};