import { Router } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = Router();

// РЕГИСТРАЦИЯ
router.post('/register', async (req, res) => {
	try {
		// генерирую соль
		const salt = await bcrypt.genSalt(10);
		// хэширую пароль
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		//создаем нового пользователя
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});

		// сохраняю пользователя
		const user = await newUser.save();
		// отправляю ответ
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Вход в систему
router.post('/login', async (req, res) => {
	try {
		// Нахожу пользователя в БД по Email
		const user = await User.findOne({ email: req.body.email });
		// Если не нашел такого, выдаю ошибку и завершаю выполнение
		if (!user) {
			return res.status(404).json('Пользователь не найден');
		}

		// Проверяю пароль в БД и введенный
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		// Если не совпадают, выбрасываю ошибку и завершаю выполнение
		if (!validPassword) {
			return res.status(400).json('Неверный пароль');
		}

		// Если всё в порядке, отправляю ответ с данными пользователя
		res.status(200).json(user);
	} catch (err) {
		// Обработка ошибок
		res.status(500).json({ error: 'Ошибка сервера. Попробуйте позже.' });
	}
});

export default router;
