import './login.css';
import useAuthStore from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useRef, useState } from 'react';
import { validateLoginForm } from '../../utils/validators';

/**
 * Компонент для страницы входа пользователя.
 *
 * Этот компонент включает форму для входа, обработку валидации данных,
 * а также взаимодействие с хранилищем состояния (Zustand store) для выполнения запроса на вход.
 */
const Login = () => {
	// Рефы для хранения значений полей email и password
	const email = useRef();
	const password = useRef();

	// Локальное состояние для хранения ошибок валидации
	const [errors, setErrors] = useState({});

	// Извлечение состояния и действий из Zustand store
	const { isFetching, loginCall, error } = useAuthStore();

	/**
	 * Обработчик события отправки формы.
	 *
	 * Выполняет валидацию введенных данных и, если ошибок нет, вызывает функцию для входа.
	 * @param {Event} e - Событие формы.
	 */
	const handleClick = async (e) => {
		e.preventDefault();

		// Сбор значений формы
		const formValues = {
			email: email.current.value,
			password: password.current.value,
		};

		// Валидация введенных данных
		const validationErrors = validateLoginForm(formValues);

		// Если есть ошибки валидации, они сохраняются в локальное состояние
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		// Очистка ошибок перед отправкой данных
		setErrors({});

		// Вызов функции для входа
		await loginCall(formValues);
	};

	return (
		<div className='login'>
			<div className='loginWrapper'>
				<div className='loginLeft'>
					<h3 className='loginLogo'>SocialApp</h3>
					<span className='loginDesc'>
						Общайтесь с друзьями и окружающим миром!
					</span>
				</div>
				<div className='loginRight'>
					<form className='loginBox' onSubmit={handleClick}>
						<input
							type='email'
							name='email'
							placeholder='Ваша почта'
							className='loginInput'
							ref={email}
						/>
						{/* Отображение ошибки email, если она есть */}
						{errors.email && <span className='error'>{errors.email}</span>}

						<input
							type='password'
							name='password'
							placeholder='Пароль'
							className='loginInput'
							ref={password}
						/>
						{/* Отображение ошибки пароля, если она есть */}
						{error && <span className='error'>{error}</span>}
						
						{/* Кнопка для отправки формы; если идет запрос, отображается индикатор загрузки */}
						<button className='loginButton' type='submit' disabled={isFetching}>
							{isFetching ? (
								<CircularProgress color='success' size={30} />
							) : (
								'Войти'
							)}
						</button>

						<div className='loginWrapperBtn'>
							<span className='loginForgot'>Забыли пароль?</span>
							<Link to={'/register'} className='loginRegisterButton'>
								Вы еще не зарегистрированы?
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
