import './conversation.css';

const Conversation = ({ user }) => {
	
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;
	
	return (
		<div className='conversation'>
			<img
				className='conversationImg'
				src={
					user?.profilePicture
						? PF + user.profilePicture
						: PF + 'person/noAvatar.png'
				}
				alt=''
			/>
			<span className='conversationName'>{user?.username}</span>
		</div>
	);
};

export default Conversation;
