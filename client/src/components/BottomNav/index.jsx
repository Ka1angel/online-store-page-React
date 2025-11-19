import style from './style.module.css'
import { useNavigate } from 'react-router-dom'

import home_icon from '../../assets/icons/home_icon.png'
import catalog_icon from '../../assets/icons/catalog_icon.png'
import favorite_icon from '../../assets/icons/favorite_icon.png'
import cart_icon from '../../assets/icons/cart_icon.png'
import account_icon from '../../assets/icons/account_icon.png'
export default function BottomNav() {
	const navigate = useNavigate()
	return (
		<div className={style.menu_bar_container}>
			<div className={style.menu_list}>
				<a
					href='#'
					onClick={e => {
						e.preventDefault()
						window.location.reload()
					}}
				>
					<img
						src={home_icon}
						alt=''
						onClick={() => navigate('/home')}
						style={{ cursor: 'pointer' }}
					/>
				</a>
				<img src={catalog_icon} alt='' />
				<img src={favorite_icon} alt='' />
				<img src={cart_icon} alt='' />
				<img src={account_icon} />
			</div>
		</div>
	)
}
