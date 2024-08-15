//подключаем все зависимости
const expess = require('express');
const app = expess();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');

dotenv.config();

//подключаемся к базе данных
const connect = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log('Это БД');
	} catch (error) {
		throw error;
	}
};

//middleware
app.use(expess.json());
app.use(helmet());
app.use(morgan('common'));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

app.listen(6600, () => {
	connect();
	console.log('сервер запущен');
});
