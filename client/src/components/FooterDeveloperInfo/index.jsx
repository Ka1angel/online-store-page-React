import style from './style.module.css'

export default function FooterDeveloperInfo({
	developer_text = '',
	tg_text = '',
	tg_link = '',
}) {
	return (
		<div className={style.developer}>
			<span className={style.developer_text}>{developer_text}</span>
			<div className={style.tg_block}>
				<svg
					width='9'
					height='8'
					viewBox='0 0 9 8'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M0.551387 3.48428L5.91242 1.10961C6.44167 0.862179 8.2365 0.070625 8.2365 0.070625C8.2365 0.070625 9.06483 -0.275705 8.99593 0.565496C8.97284 0.911826 8.78885 2.12378 8.60486 3.43463L8.02979 7.31793C8.02979 7.31793 7.98361 7.88687 7.59254 7.98576C7.20147 8.08466 6.55713 7.63943 6.44204 7.54054C6.35005 7.46647 4.71611 6.35341 4.11796 5.80929C3.95669 5.66075 3.7727 5.36407 4.14105 5.01774C4.96938 4.20136 5.95898 3.18719 6.55713 2.54418C6.83312 2.2475 7.10947 1.55484 5.95898 2.39564L2.71457 4.74548C2.71457 4.74548 2.34659 4.99291 1.65607 4.7703C0.965923 4.54769 0.160688 4.25101 0.160688 4.25101C0.160688 4.25101 -0.391654 3.87985 0.551759 3.48428H0.551387Z'
						fill='#37AEE2'
					/>
				</svg>
				<a href={tg_link} className={style.tg_text}>
					{tg_text}
				</a>
			</div>
		</div>
	)
}