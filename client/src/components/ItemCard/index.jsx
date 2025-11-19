import style from './style.module.css'

export default function ItemCard({ image, name, price, oldPrice, discount, currency }) {
	return (
		<div className={style.card}>
			<div className={style.image_wrapper}>
				<img className={style.product_image} src={image} alt={name} />
			</div>

			<div className={style.info}>
				<div className={style.price_wrapper}>
					<span className={style.price}>
						{price.toLocaleString()} {currency}
					</span>
					{oldPrice && discount && (
						<span className={style.old_price_wrapper}>
							<span className={style.old_price}>
								{oldPrice.toLocaleString()} {currency}
							</span>
							<span className={style.discount}>{discount}</span>
						</span>
					)}
				</div>
				<div className={style.name}>{name}</div>
				<button className={style.select_btn}>Выбрать</button>
			</div>
		</div>
	)
}
