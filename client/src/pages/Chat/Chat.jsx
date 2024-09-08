import './chat.css';
import Topbar from '../../components/Topbar/Topbar';
import SidebarList from '../../components/SidebarList/SidebarList';
import Conversation from '../../components/Conversations/Conversation';
import useAuthStore from '../../store/useAuthStore';
import Message from '../../components/Message/Message';
import ChatOnline from '../../components/ChatOnline/ChatOnline';
import { useEffect, useRef, useState } from 'react';
import useConversationStore from '../../store/useConversationStore';
import useMessageStore from '../../store/useMessageStore';
import { Cancel, PermMedia } from '@mui/icons-material';
import axios from 'axios';
import socket from '../../utils/socket'; // путь к вашему файлу socket.js

/**
 * Компонент `Chat` представляет собой интерфейс для общения, включая списки бесед и сообщений.
 * @returns {JSX.Element} Компонент чата.
 */

const Chat = () => {
	const {
		conversations,
		fetchConversations,
		saveCurrentChat,
		loadCurrentChat,
	} = useConversationStore(); // Получение данных бесед
	const user = useAuthStore((state) => state.getUser()); // Получение данных пользователя
	const { messages, fetchMessages, sendMessage, updateMessages } =
		useMessageStore(); // Получение и управление сообщениями
	const { onlineUsers } = useAuthStore((state) => ({
		onlineUsers: state.onlineUsers, // Получение списка онлайн пользователей
	}));
	const [currentChat, setCurrentChat] = useState(null); // Хранение текущей беседы
	const [newMessage, setNewMessage] = useState(''); // Хранение нового сообщения
	const [file, setFile] = useState(null); // Хранение выбранного файла
	const [arrivalMessage, setArrivalMessage] = useState(null); // Хранение сообщения, полученного через WebSocket
	const scrollRef = useRef(); // Ссылка на элемент для прокрутки

	// Настройка WebSocket для получения новых сообщений
	useEffect(() => {
		if (user) {
			socket.on('getMessage', (data) => {
				setArrivalMessage({
					sender: data.senderId,
					text: data.text,
					createdAt: Date.now(),
				});
			});
		}
		return () => {
			socket.off('getMessage');
		};
	}, [user]);

	// Обновление сообщений при получении нового сообщения через WebSocket
	useEffect(() => {
		if (
			arrivalMessage &&
			currentChat?.members.includes(arrivalMessage.sender)
		) {
			updateMessages(currentChat._id, arrivalMessage);
		}
	}, [arrivalMessage, currentChat, updateMessages]);

	// Загрузка бесед при монтировании компонента
	useEffect(() => {
		fetchConversations(user._id);
	}, [user._id, fetchConversations]);

	// Загрузка текущей беседы из локального хранилища
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

	// Прокрутка к последнему сообщению
	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Обработчик выбора беседы
	const handleChatSelect = (chat) => {
		setCurrentChat(chat);
		saveCurrentChat(user._id, chat);
		fetchMessages(chat._id);
	};

	// Обработчик отправки сообщения
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
			try {
				await axios.post('/api/upload', data);
			} catch (err) {
				console.error('Error uploading file:', err); // Логирование ошибки при загрузке файла
			}
		}
		await sendMessage(message);

		// Отправка сообщения через WebSocket
		const receiverId = currentChat.members.find(
			(member) => member !== user._id
		);
		socket.emit('sendMessage', {
			senderId: user._id,
			receiverId,
			text: newMessage,
		});

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

						<input placeholder='поиск по друзья временно не работает' className='chatMenuInput' />
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
										<div key={m._id} ref={scrollRef}>
											<Message
												message={m}
												own={m.sender === user._id}
												currentUser={user}
											/>
										</div>
									))}
								</div>
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
								<div className='chatBoxBottom'>
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
						<ChatOnline
							onlineUsers={onlineUsers}
							currentId={user._id}
							setCurrentChat={setCurrentChat}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Chat;
