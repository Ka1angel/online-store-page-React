import { useForm, useWatch } from 'react-hook-form'
import { useState, useRef, useEffect } from 'react'
import { login, verifyCode, generateNewOtpCode } from '../../api/api.js'
import { useNavigate } from 'react-router-dom'
import styles from './style.module.css'
import logo_icon from '../../assets/logo.png'
import User_icon from '../../assets/User.svg'
import Password_icon from '../../assets/Password.svg'

const CODE_LENGTH = 6
const TIMEOUT_SECONDS = 20

export default function Login() {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm()
	const [authStage, setAuthStage] = useState('credentials')
	const [alertMessage, setAlertMessage] = useState('')
	const [currentUserId, setCurrentUserId] = useState('')
	const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
	const codeInputRefs = useRef([])
	const [isProcessing, setIsProcessing] = useState(false)
	const [isOtpValid, setIsOtpValid] = useState(false)
	const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
	const [countdownSeconds, setCountdownSeconds] = useState(TIMEOUT_SECONDS)
	const [canRequestNewOtp, setCanRequestNewOtp] = useState(false)
	const [statusMessage, setStatusMessage] = useState('')
	const [suppressCode, setSuppressCode] = useState(false)
	const [suppressTimer, setSuppressTimer] = useState(false)
	const [suppressCodeEntered, setSuppressCodeEntered] = useState(false)
	const navigate = useNavigate()

	const [debugCode, setDebugCode] = useState('')

	const emailField = useWatch({ control, name: 'email' })
	const passwordField = useWatch({ control, name: 'password' })
	const areCredentialsFilled = !!(emailField && passwordField)

	useEffect(() => {
		if (authStage === '2fa') {
			setTimeout(() => codeInputRefs.current?.[0]?.focus?.(), 50)
		}
	}, [authStage])

	useEffect(() => {
		if (authStage !== '2fa' || isOtpValid) return

		setCountdownSeconds(TIMEOUT_SECONDS)
		setCanRequestNewOtp(false)

		const timerInterval = setInterval(() => {
			setCountdownSeconds(prev => {
				if (prev <= 1) {
					clearInterval(timerInterval)
					setCanRequestNewOtp(true)
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(timerInterval)
	}, [authStage, isOtpValid])

	const handleCredentialsSubmit = async formData => {
		setAlertMessage('')
		try {
			const response = await login(formData)

			setCurrentUserId(response.userId || '')
			setDebugCode(response.code)
			setAuthStage('2fa')
		} catch (error) {
			setAlertMessage(error?.message || 'Неизвестная ошибка')
		}
	}

	const verifyOtpCode = async (shouldShowAlert = true) => {
		const combinedCode = otpDigits.join('')
		if (combinedCode.length !== CODE_LENGTH) {
			if (shouldShowAlert)
				setAlertMessage(`Введите полный ${CODE_LENGTH}-значный код`)
			return
		}

		setIsProcessing(true)
		setAlertMessage('')

		try {
			const response = await verifyCode({
				userId: currentUserId,
				code: combinedCode,
			})

			if (response.success) {
				setIsOtpValid(true)
				setSuppressTimer(true)
				setSuppressCode(true)
				setSuppressCodeEntered(true)
				localStorage.setItem('auth_token', 'true')

				await sleep(500)
				setStatusMessage('Код верный! Выполняется вход…')

				await sleep(1000)
				setStatusMessage('Успешный вход! Перенаправление на главную страницу…')

				await sleep(1800)
				navigate('/home')
			}
		} catch (error) {
			setAlertMessage(error?.message || 'Неверный код')
			setOtpDigits(['', '', '', '', '', ''])
			setIsOtpValid(false)
			setSuppressTimer(false)
			setSuppressCode(false)
			setSuppressCodeEntered(false)

			await sleep(500)

			setTimeout(() => codeInputRefs.current?.[0]?.focus?.(), 50)
		} finally {
			setIsProcessing(false)
		}
	}

	const requestFreshOtpCode = async () => {
		setOtpDigits(['', '', '', '', '', ''])
		setCountdownSeconds(TIMEOUT_SECONDS)
		setCanRequestNewOtp(false)
		setSuppressTimer(true)
		setIsOtpValid(false)
		setSuppressCode(false)
		setSuppressCodeEntered(false)
		codeInputRefs.current?.[0]?.focus?.()

		if (currentUserId) {
			const response = await generateNewOtpCode(currentUserId)
			setDebugCode(response.code)
		}
	}

	const processDigitInput = (position, rawInput) => {
		const sanitizedInput = rawInput.replace(/\D/g, '').slice(-1)
		if (!sanitizedInput && rawInput !== '') return

		const updatedCode = [...otpDigits]
		updatedCode[position] = sanitizedInput
		setOtpDigits(updatedCode)

		if (sanitizedInput && position < CODE_LENGTH - 1) {
			codeInputRefs.current[position + 1]?.focus()
		}

		if (updatedCode.join('').length === CODE_LENGTH && !isProcessing) {
			verifyOtpCode(false)
		}
	}

	const handlePasteCode = event => {
		event.preventDefault()
		const pastedText = event.clipboardData.getData('text').replace(/\D/g, '')

		if (pastedText.length >= CODE_LENGTH) {
			const newCode = pastedText.slice(0, CODE_LENGTH).split('')
			setOtpDigits(newCode)

			setTimeout(() => {
				verifyOtpCode(false)
			}, 100)
		}
	}

	const handleDigitKeyboard = (position, keyboardEvent) => {
		const pressedKey = keyboardEvent.key
		if (pressedKey === 'Backspace') {
			if (otpDigits[position]) {
				const updatedCode = [...otpDigits]
				updatedCode[position] = ''
				setOtpDigits(updatedCode)
			} else if (position > 0) {
				codeInputRefs.current[position - 1]?.focus()
				const updatedCode = [...otpDigits]
				updatedCode[position - 1] = ''
				setOtpDigits(updatedCode)
			}
		} else if (pressedKey === 'ArrowLeft' && position > 0) {
			codeInputRefs.current[position - 1]?.focus()
		} else if (pressedKey === 'ArrowRight' && position < CODE_LENGTH - 1) {
			codeInputRefs.current[position + 1]?.focus()
		}
	}

	return (
		<form
			onSubmit={handleSubmit(handleCredentialsSubmit)}
			className={styles.wrapper}
		>
			<div className={styles.card}>
				<div className={styles.header}>
					<img className={styles.logo} src={logo_icon} alt='logo' />
				</div>

				{authStage === 'credentials' ? (
					<>
						<h3 className={styles.login_title}>
							Войдите в свой аккаунт для продолжения
						</h3>

						<div className={styles.form}>
							<div className={styles.inputWrapper}>
								<img className={styles.icon} src={User_icon} alt='email' />
								<input
									{...register('email', { required: true })}
									type='email'
									placeholder='Email'
									autoComplete='off'
								/>
							</div>

							<div className={styles.inputWrapper}>
								<img className={styles.icon} src={Password_icon} alt='pass' />
								<input
									{...register('password', { required: true })}
									type='password'
									placeholder='Пароль'
									autoComplete='new-password'
								/>
							</div>

							<button
								type='submit'
								className={`${styles.button} ${
									areCredentialsFilled ? styles.active : ''
								}`}
								disabled={!areCredentialsFilled}
							>
								Войти
							</button>

							{(errors.email || errors.password || alertMessage) && (
								<span className={styles.error}>
									{alertMessage || 'Все поля обязательны'}
								</span>
							)}
						</div>
					</>
				) : (
					<div className={styles.twofactorWrapper}>
						<div className={styles.twofactorHeader}>
							<h3 className={styles.title}>
								{isOtpValid ? '✅ Успешно!' : 'Двухфакторная аутентификация'}
							</h3>

							{!suppressCodeEntered && (
								<p className={styles.twofactorAuthenfication}>
									Введите 6-значный код
								</p>
							)}

							{debugCode && !suppressCode && (
								<div className={styles.info}>
									<strong>Код 2FA: {debugCode}</strong>
								</div>
							)}
						</div>

						<div className={styles.codeContainer}>
							{otpDigits.map((digit, index) => (
								<input
									key={index}
									ref={element => (codeInputRefs.current[index] = element)}
									inputMode='numeric'
									pattern='[0-9]*'
									type='text'
									maxLength='1'
									value={digit}
									onChange={event =>
										processDigitInput(index, event.target.value)
									}
									onKeyDown={event => handleDigitKeyboard(index, event)}
									onPaste={index === 0 ? handlePasteCode : null}
									className={`${styles.codeInput} ${
										isOtpValid ? styles.codeValid : ''
									}`}
									aria-label={`Цифра ${index + 1}`}
								/>
							))}
						</div>

						{isProcessing && <div className={styles.info}>{statusMessage}</div>}
						{alertMessage && !isProcessing && (
							<span className={styles.error}>{alertMessage}</span>
						)}

						{canRequestNewOtp ? (
							<button
								type='button'
								className={`${styles.button} ${styles.active}`}
								onClick={requestFreshOtpCode}
							>
								Получить новый код
							</button>
						) : (
							<button
								type='button'
								className={`${styles.button} ${
									otpDigits.join('').length === CODE_LENGTH && !isOtpValid
										? styles.active
										: ''
								}`}
								disabled={
									otpDigits.join('').length !== CODE_LENGTH ||
									isProcessing ||
									isOtpValid
								}
								onClick={() => verifyOtpCode(true)}
							>
								Продолжить
							</button>
						)}

						{!canRequestNewOtp && countdownSeconds > 0 && !suppressTimer && (
							<div className={styles.info}>
								Вы сможете запросить новый код через {countdownSeconds}с
							</div>
						)}
					</div>
				)}
			</div>
		</form>
	)
}
