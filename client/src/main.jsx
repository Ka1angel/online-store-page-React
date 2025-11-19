import { createRoot } from 'react-dom/client'
import Login from '../src/components/Login/index.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import PrivateRoute from './router/PrivateRoute'

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<Routes>
			<Route path='/' element={<Login />} />
			<Route
				path='/home'
				element={
					<PrivateRoute>
						<Home />
					</PrivateRoute>
				}
			/>
			<Route path='*' element={<Navigate to='/' replace />} />
		</Routes>
	</BrowserRouter>
)
