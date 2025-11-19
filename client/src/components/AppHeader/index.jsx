import style from './style.module.css'
import iconTg from '../../assets/icons/icon_tg.png'
import iconCross from '../../assets/icons/cross.svg'
import iconMore from '../../assets/icons/more_icon.svg'

export default function AppHeader({
	tgLink = '',
	tgText = '',
	closeText = '',
	showMore = false,
	onClose,
}) {
	return (
		<header>
			<div className={style.header_container}>
				<div className={style.telegram_button}>
					<a href={tgLink}>
						<img src={iconTg} alt='tg' />
						<span className={style.telegram_text}>{tgText}</span>
					</a>
				</div>

				<div
					className={style.button_close}
					onClick={onClose}
				>
					<img src={iconCross} alt='close' />
					<span>{closeText}</span>
				</div>

				{showMore && (
					<div className={style.button_more}>
						<img src={iconMore} alt='more' />
					</div>
				)}
			</div>
		</header>
	)
}
