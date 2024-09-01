import { Router } from 'express';
import Course from '../models/Course.js';

const router = Router();

// Создание нового курса
router.post('/', async (req, res) => {
	const newCourse = new Course(req.body);
	try {
		const savedCourse = await newCourse.save();
		res.status(201).json(savedCourse);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Получение всех курсов
router.get('/', async (req, res) => {
	try {
		const courses = await Course.find();
		res.status(200).json(courses);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Получение курса по ID
router.get('/:id', async (req, res) => {
	try {
		const course = await Course.findById(req.params.id);
		if (!course) {
			return res.status(404).json('Course not found');
		}
		res.status(200).json(course);
	} catch (err) {
		res.status(500).json(err);
	}
});

export default router;
