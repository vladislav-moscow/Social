import {
	Cancel,
	EmojiEmotions,
	Label,
	PermMedia,
	Room,
} from '@mui/icons-material';
import useAuthStore from '../../store/useAuthStore';

import './share.css';
import { useRef, useState } from 'react';
import axios from 'axios';
import { validateFile } from '../../utils/validateFile';

const Share = () => {
	// Получаем данные пользователя из стора
	const user = useAuthStore((state) => state.getUser());
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;
	const desc = useRef();
	const [file, setFile] = useState(null);

	const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const error = validateFile(selectedFile);
    if (error) {
      alert(error);
      return;
    }
    setFile(selectedFile);
  };

	const submitHandler = async (e) => {
		e.preventDefault();
		const newPost = {
			userId: user._id,
			desc: desc.current.value,
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
						<div className='shareOption'>
							<Label htmlColor='blue' className='shareIcon' />
							<span className='shareOptionText'>Тег</span>
						</div>
						<div className='shareOption'>
							<Room htmlColor='green' className='shareIcon' />
							<span className='shareOptionText'>Место</span>
						</div>
						<div className='shareOption'>
							<EmojiEmotions htmlColor='goldenrod' className='shareIcon' />
							<span className='shareOptionText'>Смайлики</span>
						</div>
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
