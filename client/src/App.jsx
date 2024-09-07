import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './components/AppRoutes/AppRoutes';
import socket from './utils/socket.js';
import { useEffect } from 'react';
import useAuthStore from './store/useAuthStore.js';

/**
 * Корневой компонент приложения.
 *
 * Этот компонент устанавливает соединение с WebSocket сервером,
 * обрабатывает обновление списка онлайн-пользователей и
 * рендерит маршруты приложения внутри `Router`.
 *
 * @returns {JSX.Element} - Возвращает JSX элемент, содержащий маршруты приложения внутри `Router`.
 */

function App() {
	// Извлечение текущего пользователя и функции для обновления списка онлайн-пользователей из Zustand store
	const user = useAuthStore((state) => state.getUser());
	const setOnlineUsers = useAuthStore((state) => state.setOnlineUsers);

	useEffect(() => {
		// Проверяем, если пользователь аутентифицирован
		if (user) {
			// Уведомляем сервер о том, что пользователь зашел в систему
			socket.emit('addUser', user._id);

			// Обработка события получения списка онлайн-пользователей от сервера
			socket.on('getUsers', (users) => {
				// Обновляем состояние онлайн-пользователей в хранилище
				setOnlineUsers(users.map((user) => user.userId));
			});
		}
		// Очистка эффекта
		return () => {
			// Уведомляем сервер о том, что пользователь вышел из системы, если он аутентифицирован
			if (user) {
				socket.emit('removeUser', user._id);
			}
			// Отключаем обработчик события получения списка онлайн-пользователей при размонтировании компонента
			socket.off('getUsers');
		};
	}, [user, setOnlineUsers]);
	
	return (
		<Router>
			<AppRoutes user={user} />
		</Router>
	);
}

export default App;
