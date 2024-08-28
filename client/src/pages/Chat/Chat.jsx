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

const Chat = () => {
	const { conversations, fetchConversations } = useConversationStore();
	const user = useAuthStore((state) => state.getUser());
	const { messages, fetchMessages, sendMessage } = useMessageStore();
	const [currentChat, setCurrentChat] = useState(null);
	const [newMessage, setNewMessage] = useState('');

	useEffect(() => {
		fetchConversations(user._id);
	}, [user._id, fetchConversations]);

	useEffect(() => {
		if (currentChat) {
			fetchMessages(currentChat._id);
		}
	}, [currentChat, fetchMessages]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const message = {
			sender: user._id,
			text: newMessage,
			conversationId: currentChat._id,
		};
		await sendMessage(message);
		setNewMessage('');
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
							<div key={c._id} onClick={() => setCurrentChat(c)}>
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
									<textarea
										className='chatMessageInput'
										placeholder='напишите сообщение...'
										onChange={(e) => setNewMessage(e.target.value)}
										value={newMessage}
									></textarea>
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
