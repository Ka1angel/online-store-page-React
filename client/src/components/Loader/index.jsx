// src/components/Loader/index.jsx
import style from './loader.module.css'

export default function Loader() {
	return (
		<div className={style.wrapper}>
			<img src='/favicon.svg' className={style.logo} />
			<div className={style.text}>Все загружается...</div>
		</div>
	)
}
