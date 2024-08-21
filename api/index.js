//подключаем все зависимости
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import postsRoute from './routes/posts.js';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Получаем путь к текущему файлу
const __filename = fileURLToPath(import.meta.url);
// Получаем путь к директории
const __dirname = path.dirname(__filename);

//подключаемся к базе данных
const connect = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log('Это БД');
	} catch (error) {
		throw error;
	}
};

app.use("/images", express.static(path.join(__dirname, "public/images")));

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

// Роуты
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postsRoute);

app.listen(6600, () => {
	connect();
	console.log('север ОК');
});
