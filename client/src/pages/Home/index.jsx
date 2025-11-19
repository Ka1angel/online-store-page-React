import { useState, useEffect } from 'react'
import AppHeader from '../../components/AppHeader/index'
import PromotionalBanner from '../../components/PromotionalBanner/index'
import SearchInput from '../../components/SearchInput/index.jsx'
import FooterDeveloperInfo from '../../components/FooterDeveloperInfo/index'
import BottomNav from '../../components/BottomNav/index'
import ItemCard from '../../components/ItemCard/index.jsx'
import SearchDropdown from '../../components/SearchDropdown/index.jsx'
import CategoryCarousel from '../../components/CategoryCarousel/index'
import style from './index.module.css'

export default function Home() {
	const [isSearching, setIsSearching] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [products, setProducts] = useState([])
	const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)

	useEffect(() => {
		const timeoutId = setTimeout(() => setDebouncedQuery(searchQuery), 500)
		return () => clearTimeout(timeoutId)
	}, [searchQuery])

	useEffect(() => {
		const loadProducts = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/home/products/search`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ query: debouncedQuery }),
					}
				)

				const data = await response.json()
				setProducts(data)
			} catch (error) {
				console.error(error)
			}
		}

		loadProducts()
	}, [debouncedQuery])

	const handleSuggestionSelect = suggestion => {
		setSearchQuery(suggestion)
		setDebouncedQuery(suggestion)
		setIsSearching(true)
	}

	const handleCategorySelect = category => {
		setSearchQuery(category)
		setDebouncedQuery(category)
		setIsSearching(false)
	}

	return (
		<>
			<div className={style.home_container}>
				<AppHeader
					tgLink='#'
					tgText='наш tg-канал'
					closeText={isSearching ? 'назад' : 'закрыть'}
					showMore={true}
					onClose={() => {
						setIsSearching(false)
						setSearchQuery('')
					}}
				/>

				<SearchInput
					onFocusChange={() => {
						setIsSearching(true)
						setIsDropdownOpen(true)
					}}
					onSearchChange={value => {
						setSearchQuery(value)
						if (value.trim().length > 0) {
							setIsDropdownOpen(false)
						}
					}}
					value={searchQuery}
				/>

				<div className={style.content}>
					{!isSearching && (
						<>
							<PromotionalBanner
								title='ВСЕМ КЛИЕНТАМ '
								subtitle='ДАРИМ 500 РУБ.'
								description='На первый заказ в телеграм-боте'
								link='#'
							/>

							<CategoryCarousel
								onSearchChange={setSearchQuery}
								onFocusChange={setIsSearching}
								onSelect={handleCategorySelect}
							/>

							<div className={style.products_grid}>
								{products.map(product => (
									<ItemCard
										key={product.id}
										image={product.image}
										price={product.price}
										oldPrice={product.oldPrice}
										discount={product.discount}
										name={product.name}
										currency={product.currency}
									/>
								))}
							</div>
						</>
					)}

					{isSearching && isDropdownOpen && searchQuery.trim() === '' && (
						<SearchDropdown
							onSearchChange={setSearchQuery}
							onFocusChange={setIsSearching}
							onSelect={handleSuggestionSelect}
						/>
					)}

					{isSearching && searchQuery.trim() !== '' && (
						<>
							{products.length > 0 ? (
								<div className={style.search_results}>
									{products.map(product => (
										<div key={product.id} className={style.search_result_card}>
											<img
												src={product.image}
												alt={product.name}
												className={style.search_result_image}
											/>

											<div className={style.search_result_info}>
												<div className={style.search_result_name}>
													{product.name}
												</div>

												<div className={style.search_result_price_row}>
													<span className={style.search_result_price}>
														{product.price} {product.currency}
													</span>

													{product.oldPrice && (
														<span className={style.search_result_old_price}>
															{product.oldPrice} {product.currency}
														</span>
													)}

													{product.discount && (
														<span className={style.search_result_discount}>
															-{product.discount}
														</span>
													)}
												</div>
											</div>

											<div className={style.search_go_btn}>Перейти</div>
										</div>
									))}
								</div>
							) : (
								<p style={{ padding: '16px', opacity: 0.6 }}>
									Ничего не найдено
								</p>
							)}
						</>
					)}
				</div>

				<FooterDeveloperInfo
					developer_text='Разработано на платформе Noxer'
					tg_text='noxerai_bot'
					tg_link='#'
				/>

				<BottomNav />
			</div>
		</>
	)
}
