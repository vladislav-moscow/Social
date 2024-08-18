import axios from 'axios';
import './register.css';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
	const username = useRef();
	const email = useRef();
	const password = useRef();
	const passwordAgain = useRef();
	const navigate = useNavigate();

	const handleClick = async (e) => {
		e.preventDefault();
		if (passwordAgain.current.value !== password.current.value) {
			passwordAgain.current.setCustomValidity("Пароли не совпадают");
		} else {
			const user = {
				username: username.current.value,
				email: email.current.value,
				password: password.current.value,
			};
			try {
				await axios.post('/api/auth/register', user);
				navigate('/');
			} catch (err) {
				console.log(err);
			}
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
						<input
							ref={email}
							placeholder='Ваша почта'
							className='loginInput'
						/>
						<input ref={password} placeholder='пароль' className='loginInput' />
						<input
							ref={passwordAgain}
							placeholder='пароль'
							className='loginInput'
						/>
						<button className='loginButton' type='submit'>
							Зарегистрироваться
						</button>
						<Link className='loginRegisterButton'>Уже есть аккаунт?</Link>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
