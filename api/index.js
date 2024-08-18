//подключаем все зависимости
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import postsRoute from './routes/posts.js';

dotenv.config();

const app = express();

//подключаемся к базе данных
const connect = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log('Это БД');
	} catch (error) {
		throw error;
	}
};

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

// Роуты
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postsRoute);

app.listen(6600, () => {
  connect();
  console.log('север ОК');
});
