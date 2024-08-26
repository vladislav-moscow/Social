import './chat.css';
//import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from '../../components/Topbar/Topbar';
import SidebarList from '../../components/SidebarList/SidebarList';
import Conversation from '../../components/Conversations/Conversation';
import useAuthStore from '../../store/useAuthStore';
import Message from '../../components/Message/Message';
import ChatOnline from '../../components/ChatOnline/ChatOnline';

const Chat = () => {
	const user = useAuthStore((state) => state.getUser());
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
						{
							<div>
								<Conversation user={user} />
							</div>
						}
					</div>
				</div>
				<div className='chatBox'>
					<div className='chatBoxWrapper'>
						<div className='chatBoxTop'>
							<Message />
							<Message own={true} />
							<Message />
							<Message own={true} />
						</div>
						<div className='chatBoxBottom'>
							<textarea
								className='chatMessageInput'
								placeholder='напишите сообщение...'
							></textarea>
							<button className='chatSubmitButton'>Отправить</button>
						</div>
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
