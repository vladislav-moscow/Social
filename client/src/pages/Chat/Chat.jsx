import './chat.css';
import Topbar from '../../components/Topbar/Topbar';
import SidebarList from '../../components/SidebarList/SidebarList';
import Conversation from '../../components/Conversations/Conversation';
import useAuthStore from '../../store/useAuthStore';
import Message from '../../components/Message/Message';
import ChatOnline from '../../components/ChatOnline/ChatOnline';
import { useEffect, useState } from 'react';
import useConversationStore from '../../store/useConversationStore';
import useMessageStore from '../../store/useMessageStore';
import { Cancel, PermMedia } from '@mui/icons-material';
import axios from 'axios';

const Chat = () => {
	const {
		conversations,
		fetchConversations,
		saveCurrentChat,
		loadCurrentChat,
	} = useConversationStore();
	const user = useAuthStore((state) => state.getUser());
	const { messages, fetchMessages, sendMessage } = useMessageStore();
	const [currentChat, setCurrentChat] = useState(null);
	const [newMessage, setNewMessage] = useState('');
	const [file, setFile] = useState(null);

	// Загрузка бесед при монтировании компонента
	useEffect(() => {
		fetchConversations(user._id);
	}, [user._id, fetchConversations]);

	// Загрузка текущей беседы из локального хранилища при монтировании компонента
	useEffect(() => {
		const savedChatId = loadCurrentChat(user._id);
		if (savedChatId && conversations.length > 0) {
			const chat = conversations.find((c) => c._id === savedChatId);
			if (chat) {
				setCurrentChat(chat);
				fetchMessages(chat._id);
			}
		}
	}, [conversations, user._id, fetchMessages, loadCurrentChat]);

	// Обработчик выбора беседы
	const handleChatSelect = (chat) => {
		setCurrentChat(chat);
		saveCurrentChat(user._id, chat);
		fetchMessages(chat._id);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const message = {
			sender: user._id,
			text: newMessage,
			conversationId: currentChat._id,
		};
		if (file) {
			const data = new FormData();
			const fileName = Date.now() + file.name;
			data.append('name', fileName);
			data.append('file', file);
			message.img = fileName;
			console.log(message);
			try {
				await axios.post('/api/upload', data);
			} catch (err) {}
		}
		await sendMessage(message);
		setNewMessage('');
		setFile(null);
	};

	return (
		<>
			<Topbar />
			<div className='messenger'>
				<div className='chatMenu'>
					<div className='chatMenuWrapper'>
						<div className='chatMenuSidebar'>
							<SidebarList />
						</div>

						<input placeholder='Search for friends' className='chatMenuInput' />
						{conversations.map((c) => (
							<div key={c._id} onClick={() => handleChatSelect(c)}>
								<Conversation conversation={c} currentUser={user} />
							</div>
						))}
					</div>
				</div>
				<div className='chatBox'>
					<div className='chatBoxWrapper'>
						{currentChat ? (
							<>
								<div className='chatBoxTop'>
									{messages[currentChat._id]?.map((m) => (
										<div key={m._id}>
											<Message message={m} own={m.sender === user._id} />
										</div>
									))}
								</div>
								<div className='chatBoxBottom'>
								{file && (
										<div className='chatImgPreview'>
											<img
												className='chatImg'
												src={URL.createObjectURL(file)}
												alt=''
											/>
											<Cancel
												className='chatCancelImg'
												onClick={() => setFile(null)}
											/>
										</div>
									)}
									<textarea
										className='chatMessageInput'
										placeholder='напишите сообщение...'
										onChange={(e) => setNewMessage(e.target.value)}
										value={newMessage}
									></textarea>
									<label htmlFor='file' className='shareOption'>
										<PermMedia htmlColor='tomato' className='shareIcon' />
										<span className='shareOptionText'>Фото или видео</span>
										<input
											style={{ display: 'none' }}
											type='file'
											id='file'
											accept='.png,.jpeg,.jpg'
											onChange={(e) => setFile(e.target.files[0])}
										/>
									</label>
									<button className='chatSubmitButton' onClick={handleSubmit}>
										Отправить
									</button>
								</div>
							</>
						) : (
							<span className='noConversationText'>
								Откройте бесседу и начните чат!
							</span>
						)}
					</div>
				</div>
				<div className='chatOnline'>
					<div className='chatOnlineWrapper'>
						<ChatOnline />
						<ChatOnline />
						<ChatOnline />
						<ChatOnline />
						<ChatOnline />
						<ChatOnline />
					</div>
				</div>
			</div>
		</>
	);
};

export default Chat;
