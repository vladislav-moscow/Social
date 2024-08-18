import { Router } from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = Router();

// Создание нового поста

router.post('/', async (req, res) => {
	// Создаем новый пост, используя данные из тела запроса
	const newPost = new Post(req.body);
	try {
		// Сохраняем пост в базе данных
		const savedPost = await newPost.save();
		// Возвращаем сохраненный пост
		res.status(200).json(savedPost);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Обновление существующего поста

router.put('/:id', async (req, res) => {
	try {
		// Ищем пост по ID, который передан в параметрах
		const post = await Post.findById(req.params.id);
		// Проверяем, что пользователь, обновляющий пост, является его автором
		if (post.userId === req.body.userId) {
			// Обновляем пост новыми данными из тела запроса
			await post.updateOne({ $set: req.body });
			// Возвращаем сообщение об успешном обновлении
			res.status(200).json('Пост успешно обнавлен');
		} else {
			res.status(403).json('Вы можете обновить только свои посты');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// Удаление поста

router.delete('/:id', async (req, res) => {
	try {
		// Ищем пост по ID, который передан в параметрах маршрута
		const post = await Post.findById(req.params.id);
		// Проверяем, что пользователь, удаляющий пост, является его автором
		if (post.userId === req.body.userId) {
			// Удаляем пост из базы данных
			await post.deleteOne();
			res.status(200).json('Пост успешно обновлен');
		} else {
			res.status(403).json('Вы можете удалять только свои посты');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// Лайк или дизлайк поста

router.put('/:id/like', async (req, res) => {
	try {
		// Ищем пост по ID
		const post = await Post.findById(req.params.id);
		// Если текущий пользователь еще не лайкнул пост
		if (!post.likes.includes(req.body.userId)) {
			// Добавляем ID пользователя в массив лайков
			await post.updateOne({ $push: { likes: req.body.userId } });
			// Возвращаем сообщение о том, что пост был лайкнут
			res.status(200).json('Вы лайкнули пост');
		} else {
			// Удаляем ID пользователя из массива лайков (дизлайк)
			await post.updateOne({ $pull: { likes: req.body.userId } });
			// Возвращаем сообщение о том, что пост был дизлайкнут
			res.status(200).json('Вы удалили свой лайк');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// Получение поста по ID

router.get('/:id', async (req, res) => {
	try {
		// Ищем пост по ID
		const post = await Post.findById(req.params.id);
		// Возвращаем найденный пост
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Получение всех постов для ленты новостей

router.get('/timeline/:userId', async (req, res) => {
	try {
		// Ищем текущего пользователя по ID
		const currentUser = await User.findById(req.params.userId);
		// Получаем все посты текущего пользователя
		const userPosts = await Post.find({ userId: currentUser._id });
		// Получаем посты всех пользователей, на которых подписан текущий пользователь
		const friendPosts = await Promise.all(
			currentUser.followings.map((friendId) => {
				return Post.find({ userId: friendId });
			})
		);
		// Объединяем посты текущего пользователя и его друзей и возвращаем их
		res.status(200).json(userPosts.concat(...friendPosts));
	} catch (err) {
		res.status(500).json(err);
	}
});

// Получение всех постов конкретного пользователя по его имени пользователя

router.get('/profile/:username', async (req, res) => {
	try {
		// Ищем пользователя по его имени пользователя
		const user = await User.findOne({ username: req.params.username });
		// Получаем все посты этого пользователя
		const posts = await Post.find({ userId: user._id });
		// Возвращаем найденные посты
		res.status(200).json(posts);
	} catch (err) {
		res.status(500).json(err);
	}
});

export default router;
