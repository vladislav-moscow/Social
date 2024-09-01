import mongoose from 'mongoose';

// Определяем схему для модели курса
const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
		image: {
			type: String,
		},
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    schoolName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Добавляет поля createdAt и updatedAt
);

// Экспортируем модель
export default mongoose.model('Course', CourseSchema);