import { Router } from 'express';
import Conversation from '../models/Conversation.js';

// Создаем новый экземпляр роутера
const router = Router();

// Создание новой беседы
router.post('/', async (req, res) => {
	// Создаем новую беседу, добавляя участников в массив members
	const newConversation = new Conversation({
		// Добавляем ID отправителя и получателя
		members: [req.body.senderId, req.body.receiverId],
	});
	try {
		// Сохраняем новую беседу в базе данных
		const savedConversation = await newConversation.save();
		// Возвращаем сохраненную беседу с кодом 200 (OK)
		res.status(200).json(savedConversation);
	} catch (err) {
		// Если возникает ошибка, возвращаем её с кодом 500 (Internal Server Error)
		res.status(500).json(err);
	}
});

// Получение всех бесед пользователя
router.get('/:userId', async (req, res) => {
	try {
		// Ищем все беседы, где userId присутствует в массиве members
		const conversation = await Conversation.find({
			// in ищет совпадения в массиве members
			members: { $in: [req.params.userId] },
		});
		// Возвращаем найденные беседы с кодом 200 (OK)
		res.status(200).json(conversation);
	} catch (err) {
		// Если возникает ошибка, возвращаем её с кодом 500 (Internal Server Error)
		res.status(500).json(err);
	}
});

// Получение беседы между двумя конкретными пользователями
router.get('/find/:firstUserId/:secondUserId', async (req, res) => {
	try {
		// Ищем беседу, где оба пользователя присутствуют в массиве members
		const conversation = await Conversation.findOne({
			// all требует совпадения всех элементов в массиве members
			members: { $all: [req.params.firstUserId, req.params.secondUserId] },
		});
		// Возвращаем найденную беседу с кодом 200 (OK)
		res.status(200).json(conversation);
	} catch (err) {
		// Если возникает ошибка, возвращаем её с кодом 500 (Internal Server Error)
		res.status(500).json(err);
	}
});

export default router;
