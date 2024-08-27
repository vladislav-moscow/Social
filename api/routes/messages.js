import { Router } from 'express';
import Message from '../models/Message.js';

// Создаем новый экземпляр роутера Express
const router = Router();

// Добавление нового сообщения
router.post('/', async (req, res) => {
	// Создаем новый экземпляр модели Message с данными из тела запроса (req.body)
	const newMessage = new Message(req.body);
	try {
		// Сохраняем сообщение в базе данных
		const savedMessage = await newMessage.save();
		// Возвращаем сохраненное сообщение с кодом 200 (OK)
		res.status(200).json(savedMessage);
	} catch (err) {
		// Если возникает ошибка, возвращаем ее с кодом 500 (Internal Server Error)
		res.status(500).json(err);
	}
});

// Получение всех сообщений для конкретной беседы
router.get('/:conversationId', async (req, res) => {
	try {
		// Ищем все сообщения, которые принадлежат указанной беседе
		const messages = await Message.find({
			conversationId: req.params.conversationId,
		});
		// Возвращаем найденные сообщения с кодом 200 (OK)
		res.status(200).json(messages);
	} catch (err) {
		// Если возникает ошибка, возвращаем ее с кодом 500 (Internal Server Error)
		res.status(500).json(err);
	}
});

export default router;
