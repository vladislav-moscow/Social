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

const Share = () => {
	// Получаем данные пользователя из стора
	const user = useAuthStore((state) => state.getUser());
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;
	const desc = useRef();
	//const location = useRef();
	const [file, setFile] = useState(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Состояние для отображения пикера
	const [location, setLocation] = useState(''); // Состояние для места
	const [isEditingLocation, setIsEditingLocation] = useState(true); // Состояние для управления режимом редактирования места
	const [tags, setTags] = useState([]); // Состояние для хранения тегов
	const [tagInput, setTagInput] = useState(''); // Состояние для инпута тегов
	const [showTags, setShowTags] = useState(true); // Показывать или скрывать теги

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		const error = validateFile(selectedFile);
		if (error) {
			alert(error);
			return;
		}
		setFile(selectedFile);
	};

	const onEmojiClick = (emojiObject) => {
		console.log(emojiObject);
		if (emojiObject && emojiObject.emoji) {
			desc.current.value += emojiObject.emoji;
		}
	};

	const handleLocationChange = (e) => {
		setLocation(e.target.value);
	};

	const handleRemoveLocation = () => {
		setLocation('');
		setIsEditingLocation(true);
	};
	

	// Добавление тега при нажатии Enter или запятой
	const handleTagInputKeyDown = (e) => {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			if (tagInput.trim()) {
				setTags((prevTags) => [...prevTags, tagInput.trim()]);
				setTagInput('');
			}
		}
	};

	// Удаление тега
	const handleRemoveTag = (tagToRemove) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		const newPost = {
			userId: user._id,
			desc: desc.current.value,
			location: location, // Добавляем место в данные поста
			tags: tags, // Добавляем теги в данные поста
		};
		if (file) {
			const data = new FormData();
			const fileName = Date.now() + file.name;
			data.append('name', fileName);
			data.append('file', file);
			newPost.img = fileName;
			console.log(newPost);
			try {
				await axios.post('/api/upload', data);
			} catch (err) {}
		}
		try {
			await axios.post('/api/posts', newPost);
			setShowTags(false); // Скрываем теги после отправки
			setShowEmojiPicker(false);

			window.location.reload();
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
