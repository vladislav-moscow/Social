import { useForm } from '../../hooks/useForm';
import './login.css';
import useAuthStore from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { validateForm } from '../../utils/validators';

const Login = () => {
	const { formValues, formErrors, handleInput, resetForm } = useForm({
		email: '',
		password: '',
	});
	// Извлечение состояния и действий из Zustand store
	const { isFetching, loginCall } = useAuthStore();

	const handleClick = async (e) => {
		e.preventDefault();

		const validationErrors = validateForm(formValues);
		if (Object.keys(validationErrors).length === 0) {
			await loginCall(formValues);
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
							type='email'
							name='email'
							placeholder='Ваша почта'
							className='loginInput'
							value={formValues.email}
							onChange={handleInput}
						/>
						{formErrors.email && (
							<span className='error'>{formErrors.email}</span>
						)}
						<input
							type='password'
							name='password'
							placeholder='Пароль'
							className='loginInput'
							value={formValues.password}
							onChange={handleInput}
						/>
						{formErrors.password && (
							<span className='error'>{formErrors.password}</span>
						)}
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
