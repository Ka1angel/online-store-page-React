import { useState } from 'react'
import style from './style.module.css'
import search_icon from '../../assets/icons/search_icon.svg'
export default function SearchInput({ onFocusChange, onSearchChange, value }) {
	const [placeholder, setPlaceholder] = useState('Найти товары')

	const handleFocus = () => {
		setPlaceholder('')
		onFocusChange(true)
	}

	return (
		<div className={style.search_container}>
			<img className={style.search_icon} src={search_icon} alt='search_icon' />
			<input
				className={style.search_input}
				type='text'
				placeholder={placeholder}
				value={value ?? ''}
				onFocus={handleFocus}
				onChange={e => onSearchChange(e.target.value)}
			/>
		</div>
	)
}
