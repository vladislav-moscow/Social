import { Router } from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const router = Router();

// Создание нового комментария для поста
router.post('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, comment, img } = req.body;

    // Проверка, существует ли пост с указанным ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    // Создание комментария
    const newComment = new Comment({
      postId,
      userId,
      comment,
      img,
    });

    // Сохранение комментария в базу данных
    await newComment.save();
		console.log("коммент успешно добавлен");

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания комментария', error });
  }
});

// Получение всех комментариев для конкретного поста
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    // Проверка, существует ли пост с указанным ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    // Поиск всех комментариев для данного поста
    const comments = await Comment.find({ postId });
		console.log("пост успешно найден");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения комментариев', error });
  }
});

export default router;
