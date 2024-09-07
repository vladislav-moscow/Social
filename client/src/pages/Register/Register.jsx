import './register.css';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateRegisterForm } from '../../utils/validators';
import useAuthStore from '../../store/useAuthStore';
import { CircularProgress } from '@mui/material';

/**
 * Компонент для страницы регистрации пользователя.
 *
 * Этот компонент включает форму для регистрации, обработку валидации данных,
 * а также взаимодействие с хранилищем состояния (Zustand store) для выполнения запроса на регистрацию.
 *
 * @returns {JSX.Element} Компонент страницы регистрации.
 */
const Register = () => {
	// Рефы для хранения значений полей ввода
	const username = useRef();
	const email = useRef();
	const password = useRef();
	const passwordAgain = useRef();

	// Используется для навигации после успешной регистрации
	const navigate = useNavigate();

	// Локальное состояние для хранения ошибок валидации
	const [errors, setErrors] = useState({});

	// Извлечение состояния и действий из Zustand store
	const { isFetching, registerCall, clearError } = useAuthStore();


	/**
	 * Обработчик события отправки формы.
	 *
	 * Выполняет валидацию введенных данных и, если ошибок нет, вызывает функцию для регистрации.
	 * 
	 * @param {Event} e - Событие формы.
	 * @returns {Promise<void>}
	 */
	
	const handleClick = async (e) => {
		e.preventDefault();

		// Сбор значений формы
		const formValues = {
			username: username.current.value,
			email: email.current.value,
			password: password.current.value,
			passwordAgain: passwordAgain.current.value,
		};

		// Валидация введенных данных
		const validationErrors = validateRegisterForm(formValues);

		// Если есть ошибки валидации, они сохраняются в локальное состояние
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		// Очистка предыдущих ошибок, если они были
		clearError();

		try {
			// Вызов функции для регистрации
			await registerCall({
				username: formValues.username,
				email: formValues.email,
				password: formValues.password,
			});

			// Перенаправление на главную страницу после успешной регистрации
			navigate('/');
		} catch (err) {
			console.log(err);
		}
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
							ref={username}
							placeholder='Ваше имя'
							className='loginInput'
						/>
						{/* Отображение ошибки имени пользователя, если она есть */}
						{errors.username && (
							<span className='error'>{errors.username}</span>
						)}

						<input
							ref={email}
							placeholder='Ваша почта'
							className='loginInput'
						/>
						{/* Отображение ошибки email, если она есть */}
						{errors.email && <span className='error'>{errors.email}</span>}

						<input ref={password} placeholder='пароль' className='loginInput' />
						{/* Отображение ошибки пароля, если она есть */}
						{errors.password && (
							<span className='error'>{errors.password}</span>
						)}

						<input
							ref={passwordAgain}
							placeholder='пароль'
							className='loginInput'
						/>
						{/* Отображение ошибки подтверждения пароля, если она есть */}
						{errors.passwordAgain && (
							<span className='error'>{errors.passwordAgain}</span>
						)}

						{/* Кнопка для отправки формы; если идет запрос, отображается индикатор загрузки */}
						<button className='loginButton' type='submit'>
							{isFetching ? (
								<CircularProgress color='success' size={30} />
							) : (
								'Зарегистрироваться'
							)}
						</button>

						{/* Ссылка для перехода на страницу входа, если у пользователя уже есть аккаунт */}
						<Link to={'/login'} className='loginRegisterButton'>
							Уже есть аккаунт?
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
