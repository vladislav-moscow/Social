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

	//save user and respond
    
	
});

module.exports = router;
