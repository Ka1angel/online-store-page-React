import { Swiper, SwiperSlide } from 'swiper/react'
import { useRef } from 'react'
import { Mousewheel, Navigation, Keyboard } from 'swiper/modules'
import 'swiper/css'
import style from './style.module.css'
import 'swiper/css/navigation'

import accessories_icon from '../../assets/category_img/category1.png'
import tshirt_icon from '../../assets/category_img/category2.png'
import hoodies_icon from '../../assets/category_img/category3.png'
import jacket_icon from '../../assets/category_img/category4.png'
import trousers_icon from '../../assets/category_img/category5.png'
import certificate_icon from '../../assets/category_img/category6.png'

const categories = [
	{ id: 1, name: 'Аксессуары', img: accessories_icon, productName: 'Брелок' },
	{ id: 2, name: 'Футболки', img: tshirt_icon, productName: 'Футболка' },
	{ id: 3, name: 'Толстовки', img: hoodies_icon, productName: 'свитшот' },
	{ id: 4, name: 'Куртки', img: jacket_icon, productName: 'куртка' },
	{
		id: 5,
		name: 'Штаны',
		img: trousers_icon,
		productName: 'Шорты',
	},
	{
		id: 6,
		name: 'Сертификаты',
		img: certificate_icon,
		productName: 'Сертификат',
	},
]

export default function CategoryCarousel({ onSearchChange, onFocusChange, onSelect }) {
	const handleClick = cat => {
		console.log('category: click ->', cat)
		if (typeof onSelect === 'function') {
			onSelect(cat)
		} else {
			onSearchChange(cat)
			onFocusChange(false)
		}
	}

	return (
		<div className={style.slider_wrapper}>
			<Swiper
				modules={[Mousewheel, Navigation, Keyboard]}
				spaceBetween={30}
				slidesPerView={5}
				loop={true}
				mousewheel={true}
				navigation={{
					className: style.swiper_navigation,
					enabled: true,
				}}
				keyboard={{
					enabled: true,
				}}
			>
				{categories.map(cat => (
					<SwiperSlide key={cat.id}>
						<div className={style.card}>
							<img
								src={cat.img}
								alt={cat.name}
								onClick={() => handleClick(cat.productName)}
								className={style.card_img}
							/>
							<span className={style.card_name}>{cat.name}</span>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}
