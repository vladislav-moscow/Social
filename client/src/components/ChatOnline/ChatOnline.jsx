import './chatOnline.css';

const ChatOnline = () => {
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;

	return (
		<div className='chatOnline'>
			<div className='chatOnlineFriend'>
				<div className='chatOnlineImgContainer'>
					<img className='chatOnlineImg' src={PF + 'person/10.jpg'} alt='' />
					<div className='chatOnlineBadge'></div>
				</div>
				<span className='chatOnlineName'>John Snow</span>
			</div>
		</div>
	);
};

export default ChatOnline;
