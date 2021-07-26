import { createContext, useContext } from 'react'
import { useAuth } from './AuthState'
import App from '../App'
import Login from './Login'

export const LocalStateContext = createContext()

export default function LocalState() {
	const { isLoading, isAuthenticated } = useAuth()
	
	return !isLoading ? isAuthenticated ? (
		<LocalStateContext.Provider value={{}}>
			<App/>
		</LocalStateContext.Provider>
	) : <Login/>
	: null
}

export const useLocalState = () => useContext(LocalStateContext)