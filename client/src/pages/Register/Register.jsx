import './register.css';

const Register = () => {
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
						<input placeholder='Ваше имя' className='loginInput' />
						<input placeholder='Ваша почта' className='loginInput' />
						<input placeholder='пароль' className='loginInput' />
						<input placeholder='пароль' className='loginInput' />
						<button className='loginButton'>Зарегистрироваться</button>
						<h3 className='loginRegisterButton'>Уже есть аккаунт?</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
