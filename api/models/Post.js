import mongoose from 'mongoose';

//создаем новую таблицу постов
const PostSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			max: 500,
		},
		img: {
			type: String,
		},
		likes: {
			type: Array,
			default: [],
		},
		tags: {
			type: [String], // Массив строк для хранения тегов
			default: [],
		},
		location: {
			type: String, // Строка для хранения местоположения
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Post', PostSchema);
