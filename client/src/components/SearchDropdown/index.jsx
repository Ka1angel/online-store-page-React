import style from './style.module.css'

import search_icon from '../../assets/icons/search_icon.svg'
export default function SearchDropdown({ onSearchChange, onFocusChange, onSelect }) {
	const items = [
		'Футболка',
		'Куртка',
		'Свитшот женский',
		'Сертификат',
		'Шапка',
		'Брелок',
		'Yamal',
	]

	const handleClick = item => {
		console.log('SearchSuggestions: click ->', item)
		if (typeof onSelect === 'function') {
			onSelect(item)
		} else {
			onSearchChange(item)
			onFocusChange(false)
		}
	}

	return (
		<div className={style.suggestions_container}>
			<h3>Часто ищут:</h3>
			<ul>
				{items.map((item, i) => (
					<li
						key={i}
						onMouseDown={e => {
							e.preventDefault()
							handleClick(item)
						}}
						onClick={() => handleClick(item)}
						style={{ cursor: 'pointer' }}
					>
						<img className={style.icon} src={search_icon} alt='иконка поиска' />
						{item}
					</li>
				))}
			</ul>
		</div>
	)
}
