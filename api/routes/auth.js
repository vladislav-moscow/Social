const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require("bcrypt");

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
	}catch (err) {
		res.status(500).json(err)
	}
});

//Вход в систему
router.post("/login", async (req, res) => {
  try {
		//нахожу пользователя в БД по Email
    const user = await User.findOne({ email: req.body.email });
		// еслм не нашел такого выдаю ошибку
    !user && res.status(404).json("Пользователь не найден");

		//проверяю пароль в БД и введеный  
    const validPassword = await bcrypt.compare(req.body.password, user.password)
		//если не совпадают выбрасываю ошибку
    !validPassword && res.status(400).json("Неверный пароль")
		// отправляю ответ
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
