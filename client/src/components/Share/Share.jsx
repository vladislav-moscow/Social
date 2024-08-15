import { EmojiEmotions, Label, PermMedia, Room } from '@mui/icons-material';

import './share.css';

const Share = () => {
	return (
		<div className='share'>
			<div className='shareWrapper'>
				<div className='shareTop'>
					<img className='shareProfileImg' src='/assets/person/1.jpg' alt='avatarPerson' />
					<input
						placeholder="Сообщение..."
						className='shareInput'
					/>
				</div>
				<hr className='shareHr' />
				<div className='shareBottom'>
					<div className='shareOptions'>
						<div className='shareOption'>
							<PermMedia htmlColor='tomato' className='shareIcon' />
							<span className='shareOptionText'>Фото или видео</span>
						</div>
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
					<button className='shareButton'>Опубликовать</button>
				</div>
			</div>
		</div>
	);
};

export default Share;
