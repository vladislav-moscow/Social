import { Router } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = Router();

// Обновить данные пользователя
router.put('/:id', async (req, res) => {
	// проверяем id из бд раверн параметру который в стоке или администратору
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		// если пользователь хочет обновить пароль то сгенерируем еще раз
		if (req.body.password) {
			try {
				//получаем соль, хэшируем  пароль и обновляем
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (err) {
				return res.status(500).json(err);
			}
		}
		try {
			//ищем пользователя в базе данных и получаем что он хочет обновить
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			});
			//получаем ответ
			res.status(200).json('Данные пользователя обновлены');
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json('Вы не можете обновить не свой аккаунт!');
	}
});

// Удаление пользователя
router.delete('/:id', async (req, res) => {
	// проверяем есть ли такое пользователь с таким ид или является он админом
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			//находи пользователь в бд и удаляем
			await User.findByIdAndDelete(req.params.id);
			res.status(200).json('Пользователь удален');
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json('Вы не можете удалять не свой аккаунт!');
	}
});

//Получить пользователя
router.get('/', async (req, res) => {
	const userId = req.query.userId;
  const username = req.query.username;
		try {
		// если есть id то находим пользователя по id в бд
		const user = userId
			? await User.findById(userId)
			: await User.findOne({ username: username });
			if (!user) {
				return res.status(404).json({ message: "Пользователь не найден" });
			}
		// убираем ненужные свойства
		const { password, updatedAt, ...other } = user._doc;
		// Возвращаем остальные данные пользователя
		res.status(200).json(other);
	} catch (err) {
		console.error("Ошибка получения пользователя:", err);
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
	}
});

//подписаться на пользователя

/**
 *
 */
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
				// Добавляем пользователя, на которого подписываемся, в список подписок
				await currentUser.updateOne({ $push: { followings: req.params.id } });
				res.status(200).json('user has been followed');
			} else {
				res.status(403).json('you allready follow this user');
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json('you cant follow yourself');
	}
});

//отписаться от пользователя

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
				// Удаляем пользователя, от которого отписываемся, из списка подписок
				await currentUser.updateOne({ $pull: { followings: req.params.id } });
				res.status(200).json('user has been unfollowed');
			} else {
				res.status(403).json('you dont follow this user');
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json('you cant unfollow yourself');
	}
});

export default router;
