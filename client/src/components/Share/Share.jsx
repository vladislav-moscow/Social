import {
	Cancel,
	EmojiEmotions,
	Label,
	PermMedia,
	Room,
} from '@mui/icons-material';
import useAuthStore from '../../store/useAuthStore';
import EmojiPicker from 'emoji-picker-react'; // Импортируем библиотеку Emoji Picker
import './share.css';
import { useRef, useState } from 'react';
import axios from 'axios';
import { validateFile } from '../../utils/validateFile';

/**
 * Компонент `Share` предоставляет интерфейс для создания и публикации нового поста.
 * Пользователь может добавлять текст, фотографии, теги, место и смайлы.
 * @returns {JSX.Element} - Рендерит компонент для создания поста.
 */

const Share = () => {
	// Получаем данные текущего пользователя из Zustand store
	const user = useAuthStore((state) => state.getUser());
	const PF = import.meta.env.VITE_PUBLIC_FOLDER; // Путь к публичной папке для профиля
	const desc = useRef(); // Ссылка на инпут для ввода текста поста
	const [file, setFile] = useState(null); // Состояние для хранения загруженного файла
	const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Состояние для отображения/скрытия пикера смайлов
	const [location, setLocation] = useState(''); // Состояние для хранения информации о месте
	const [isEditingLocation, setIsEditingLocation] = useState(true); // Состояние для управления режимом редактирования места
	const [tags, setTags] = useState([]); // Состояние для хранения тегов
	const [tagInput, setTagInput] = useState(''); // Состояние для значения инпута тегов
	const [showTags, setShowTags] = useState(true); // Состояние для отображения/скрытия тегов

	/**
	 * Обработчик изменения файла. Валидирует файл и обновляет состояние.
	 * @param {Event} e - Событие изменения файла.
	 */
	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		const error = validateFile(selectedFile); // Валидация файла
		if (error) {
			alert(error); // Показ ошибки, если файл невалиден
			return;
		}
		setFile(selectedFile); // Обновляем состояние с выбранным файлом
	};

	/**
	 * Обработчик выбора смайлов. Добавляет выбранный смайл в текст поста.
	 * @param {Object} emojiObject - Объект выбранного смайла.
	 */
	const onEmojiClick = (emojiObject) => {
		console.log(emojiObject);
		if (emojiObject && emojiObject.emoji) {
			desc.current.value += emojiObject.emoji; // Добавляем смайл в текст
		}
	};

	/**
	 * Обработчик изменения значения инпута для места.
	 * @param {Event} e - Событие изменения значения инпута.
	 */
	const handleLocationChange = (e) => {
		setLocation(e.target.value); // Обновляем состояние с новым значением места
	};

	/**
	 * Обработчик удаления информации о месте.
	 */
	const handleRemoveLocation = () => {
		setLocation(''); // Очищаем информацию о месте
		setIsEditingLocation(true); // Включаем режим редактирования
	};

	/**
	 * Обработчик нажатия клавиш в инпуте для тегов. Добавляет тег при нажатии Enter или запятой.
	 * @param {Event} e - Событие нажатия клавиш.
	 */
	const handleTagInputKeyDown = (e) => {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			if (tagInput.trim()) {
				setTags((prevTags) => [...prevTags, tagInput.trim()]); // Добавляем тег в список
				setTagInput(''); // Очищаем инпут для тегов
			}
		}
	};

	/**
	 * Обработчик удаления тега из списка.
	 * @param {string} tagToRemove - Тег, который нужно удалить.
	 */
	const handleRemoveTag = (tagToRemove) => {
		setTags(tags.filter((tag) => tag !== tagToRemove)); // Фильтруем список тегов
	};

	/**
	 * Обработчик отправки формы. Создает новый пост и отправляет его на сервер.
	 * @param {Event} e - Событие отправки формы.
	 */
	const submitHandler = async (e) => {
		e.preventDefault();
		const newPost = {
			userId: user._id,
			desc: desc.current.value, // Текст поста
			location: location, // Место
			tags: tags, // Теги
		};
		if (file) {
			const data = new FormData();
			const fileName = Date.now() + file.name; // Генерация уникального имени файла
			data.append('name', fileName);
			data.append('file', file);
			newPost.img = fileName; // Добавляем имя файла к данным поста
			console.log(newPost);
			try {
				await axios.post('/api/upload', data); // Загружаем файл на сервер
			} catch (err) {}
		}
		try {
			await axios.post('/api/posts', newPost); // Отправляем данные поста на сервер
			setShowTags(false); // Скрываем теги после отправки
			setShowEmojiPicker(false); // Скрываем пикер смайлов

			window.location.reload(); // Перезагружаем страницу после отправки
		} catch (err) {}
	};

	return (
		<div className='share'>
			<div className='shareWrapper'>
				<div className='shareTop'>
					<img
						className='shareProfileImg'
						src={
							user.profilePicture
								? PF + user.profilePicture
								: PF + 'person/noAvatar.png'
						}
						alt={user.username}
					/>
					<input placeholder='Сообщение...' className='shareInput' ref={desc} />
				</div>
				<hr className='shareHr' />
				{file && (
					<div className='shareImgContainer'>
						<img className='shareImg' src={URL.createObjectURL(file)} alt='' />
						<Cancel className='shareCancelImg' onClick={() => setFile(null)} />
					</div>
				)}
				{/* Абсолютное позиционирование тегов */}
				{showTags && tags.length > 0 && (
					<div className='tagsOverlay'>
						{tags.map((tag, index) => (
							<div className='tagItem' key={index}>
								<span>{tag}</span>
								<Cancel
									className='tagCancel'
									onClick={() => handleRemoveTag(tag)}
								/>
							</div>
						))}
					</div>
				)}
				<form className='shareBottom' onSubmit={submitHandler}>
					<div className='shareOptions'>
						<label htmlFor='file' className='shareOption'>
							<PermMedia htmlColor='tomato' className='shareIcon' />
							<span className='shareOptionText'>Фото или видео</span>
							<input
								style={{ display: 'none' }}
								type='file'
								id='file'
								accept='.png,.jpeg,.jpg'
								onChange={handleFileChange}
							/>
						</label>
						{/* Инпут для тегов */}
						<div className='shareOption'>
							<Label htmlColor='blue' className='shareIcon' />
							<input
								type='text'
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								onKeyDown={handleTagInputKeyDown}
								placeholder='Добавить теги'
								className='tagInput'
							/>
						</div>
						{/* Реализуем выбор места */}
						<div className='shareOption'>
							<Room htmlColor='green' className='shareIcon' />
							{isEditingLocation ? (
								// Если пользователь редактирует место, показываем инпут
								<input
									type='text'
									value={location}
									onChange={handleLocationChange}
									placeholder='Где вы находитесь?'
									onBlur={() => setIsEditingLocation(false)} // Скрываем инпут при потере фокуса
									className='locationInput'
								/>
							) : (
								// Если место выбрано, показываем текст с местом и крестик для удаления
								<div className='selectedLocation'>
									<span className='locationText'>{location}</span>
									<Cancel
										className='locationCancel'
										onClick={handleRemoveLocation}
									/>
								</div>
							)}
						</div>
						<div
							className='shareOption'
							onClick={() => setShowEmojiPicker(!showEmojiPicker)}
						>
							<EmojiEmotions htmlColor='goldenrod' className='shareIcon' />
							<span className='shareOptionText'>Смайлики</span>
						</div>
						{showEmojiPicker && (
							<div className='emojiPickerContainer'>
								<EmojiPicker onEmojiClick={onEmojiClick} />
							</div>
						)}
					</div>
					<button className='shareButton' type='submit'>
						Опубликовать
					</button>
				</form>
			</div>
		</div>
	);
};

export default Share;
