import { Router } from 'express';
import Job from '../models/Job.js'; // Импортируем модель Job

const router = Router();

// Маршрут для получения всех работ
router.get('/', async (req, res) => {
	try {
		// Находим все записи в коллекции работ
		const jobs = await Job.find();
		// Возвращаем список всех работ
		res.status(200).json(jobs);
	} catch (err) {
		// Обрабатываем ошибки и возвращаем сообщение об ошибке с кодом 500
		res.status(500).json(err);
	}
});

// Маршрут для создания новой работы
router.post('/', async (req, res) => {
	try {
		// Создаем новый объект работы с данными из тела запроса
		const newJob = new Job(req.body);
		// Сохраняем новую работу в базе данных
		const savedJob = await newJob.save();
		// Возвращаем сохраненный объект работы в ответе
		res.status(200).json(savedJob);
	} catch (err) {
		// Обрабатываем ошибки и возвращаем сообщение об ошибке с кодом 500
		res.status(500).json(err);
	}
});

export default router;
