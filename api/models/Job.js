import mongoose from 'mongoose';

// Создаем схему для таблицы работ (Jobs)
const JobSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			max: 100, // Ограничение на количество символов в названии
		},
		description: {
			type: String,
			required: true,
			max: 1000, // Ограничение на количество символов в описании
		},
		image: {
			type: String, // Ссылка на изображение
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		salary: {
			type: String,
		},
	},
	{ timestamps: true } // Автоматическое добавление полей createdAt и updatedAt
);

export default mongoose.model('Job', JobSchema);
