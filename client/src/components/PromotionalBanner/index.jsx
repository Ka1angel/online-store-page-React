import style from './style.module.css'

export default function PromotionalBanner({
	title = '',
	subtitle = '',
	description = '',
	link = '',
}) {
	return (
		<div className={style.banner}>
			<h1>{title}</h1>
			<h1>{subtitle}</h1>
			<h4>{description}</h4>
			<a className={style.baner_button} href={link}>
				Подробнее
			</a>
		</div>
	)
}
