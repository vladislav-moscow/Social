import './login.css';

const Login = () => {
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
					<div className='loginBox'>
						<input placeholder='Ваша почта' className='loginInput' />
						<input placeholder='Пароль' className='loginInput' />
						<button className='loginButton'>Вход</button>
						<span className='loginForgot'>Забыли пароль?</span>
						<button className='loginRegisterButton'>
							Регистрация
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
