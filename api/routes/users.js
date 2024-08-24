import { Router } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = Router(); // Создаем новый экземпляр Router.

// Обновление данных пользователя
router.put('/:id', async (req, res) => {
	// Проверяем, что ID пользователя совпадает с ID в параметре URL или пользователь является администратором
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		// Если пользователь хочет обновить пароль, хэшируем новый пароль перед сохранением
		if (req.body.password) {
			try {
				// Генерируем соль и хэшируем пароль
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (err) {
				return res.status(500).json(err); // Если произошла ошибка, возвращаем статус 500 и сообщение об ошибке
			}
		}
		try {
			// Обновляем данные пользователя в базе данных
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body, // Обновляем только те поля, которые переданы в теле запроса
			});
			// Возвращаем сообщение об успешном обновлении
			res.status(200).json('Данные пользователя обновлены');
		} catch (err) {
			return res.status(500).json(err); // Если произошла ошибка, возвращаем статус 500 и сообщение об ошибке
		}
	} else {
		// Если ID пользователя не совпадает с ID в параметре URL и пользователь не является администратором, возвращаем ошибку 403
		return res.status(403).json('Вы не можете обновить не свой аккаунт!');
	}
});

// Удаление пользователя
router.delete('/:id', async (req, res) => {
	// Проверяем, что ID пользователя совпадает с ID в параметре URL или пользователь является администратором
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			// Находим пользователя в базе данных и удаляем его
			await User.findByIdAndDelete(req.params.id);
			res.status(200).json('Пользователь удален'); // Возвращаем сообщение об успешном удалении
		} catch (err) {
			return res.status(500).json(err); // Если произошла ошибка, возвращаем статус 500 и сообщение об ошибке
		}
	} else {
		// Если ID пользователя не совпадает с ID в параметре URL и пользователь не является администратором, возвращаем ошибку 403
		return res.status(403).json('Вы не можете удалять не свой аккаунт!');
	}
});

// Получение пользователя
router.get('/', async (req, res) => {
	// Получаем userId и username из запроса
	const userId = req.query.userId;
	const username = req.query.username;
	try {
		// Если передан userId, ищем пользователя по ID, иначе ищем по имени пользователя
		const user = userId
			? await User.findById(userId)
			: await User.findOne({ username: username });
		if (!user) {
			// Если пользователь не найден, возвращаем статус 404 и сообщение об ошибке
			return res.status(404).json({ message: 'Пользователь не найден' });
		}
		// Убираем ненужные свойства (например, пароль) из ответа
		const { password, updatedAt, ...other } = user._doc;
		// Возвращаем остальные данные пользователя
		res.status(200).json(other);
	} catch (err) {
		console.error('Ошибка получения пользователя:', err); // Логируем ошибку на сервере
		res.status(500).json({ message: 'Ошибка сервера', error: err.message }); // Возвращаем статус 500 и сообщение об ошибке
	}
});

// Получение списка друзей пользователя по его ID
router.get("/friends/:userId", async (req, res) => {
  try {
    // Находим пользователя в базе данных по его ID, полученному из параметров запроса
    const user = await User.findById(req.params.userId);

    // Получаем данные о друзьях пользователя, используя Promise.all для параллельного выполнения запросов
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        // Для каждого ID друга выполняем запрос к базе данных для получения информации о друге
        return User.findById(friendId);
      })
    );

    // Формируем список друзей, включая только необходимые поля: _id, username и profilePicture
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });

    // Возвращаем список друзей в формате JSON с кодом состояния 200 (OK)
    res.status(200).json(friendList);
  } catch (err) {
    // В случае ошибки возвращаем сообщение об ошибке с кодом состояния 500 (Internal Server Error)
    res.status(500).json(err);
  }
});

// Подписка на пользователя
router.put('/:id/follow', async (req, res) => {
	// Проверяем, что пользователь не пытается подписаться на самого себя
	if (req.body.userId !== req.params.id) {
		try {
			// Ищем пользователя, на которого хотят подписаться
			const user = await User.findById(req.params.id);
			// Ищем текущего пользователя, который хочет подписаться
			const currentUser = await User.findById(req.body.userId);
			// Проверяем, подписан ли текущий пользователь на этого пользователя
			if (!user.followers.includes(req.body.userId)) {
				// Если не подписан, добавляем текущего пользователя в список подписчиков
				await user.updateOne({ $push: { followers: req.body.userId } });
				// Добавляем пользователя, на которого подписываемся, в список подписок текущего пользователя
				await currentUser.updateOne({ $push: { followings: req.params.id } });
				res.status(200).json('Пользователь добавлен в подписки');
			} else {
				// Если текущий пользователь уже подписан, возвращаем ошибку 403
				res.status(403).json('Вы уже подписаны на этого пользователя');
			}
		} catch (err) {
			// Если произошла ошибка, возвращаем статус 500 и сообщение об ошибке
			res.status(500).json(err);
		}
	} else {
		// Если пользователь пытается подписаться на самого себя, возвращаем ошибку 403
		res.status(403).json('Вы не можете подписаться на самого себя');
	}
});

// Отписка от пользователя
router.put('/:id/unfollow', async (req, res) => {
	// Проверяем, что пользователь не пытается отписаться от самого себя
	if (req.body.userId !== req.params.id) {
		try {
			// Ищем пользователя, от которого хотят отписаться
			const user = await User.findById(req.params.id);
			// Ищем текущего пользователя, который хочет отписаться
			const currentUser = await User.findById(req.body.userId);
			// Проверяем, подписан ли текущий пользователь на этого пользователя
			if (user.followers.includes(req.body.userId)) {
				// Если подписан, удаляем текущего пользователя из списка подписчиков
				await user.updateOne({ $pull: { followers: req.body.userId } });
				// Удаляем пользователя, от которого отписываемся, из списка подписок текущего пользователя
				await currentUser.updateOne({ $pull: { followings: req.params.id } });
				res.status(200).json('Пользователь удален из подписок');
			} else {
				// Если текущий пользователь не подписан, возвращаем ошибку 403
				res.status(403).json('Вы не подписаны на этого пользователя');
			}
		} catch (err) {
			// Если произошла ошибка, возвращаем статус 500 и сообщение об ошибке
			res.status(500).json(err);
		}
	} else {
		// Если пользователь пытается отписаться от самого себя, возвращаем ошибку 403
		res.status(403).json('Вы не можете отписаться от самого себя');
	}
});

export default router;
