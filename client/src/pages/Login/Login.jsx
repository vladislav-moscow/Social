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
						<div className='loginWrapperBtn'>
							<span className='loginForgot'>Забыли пароль?</span>
							<span className='loginRegisterButton'>
								Вы еще не зарегистрированы?
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
