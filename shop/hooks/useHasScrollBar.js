import { useState, useEffect } from 'react'

export default function useHasScrollBar() {
	const [hasScrollBar, setHasScrollBar] = useState({
		windowHeight: undefined,
		bodyHeight: undefined
	})
	useEffect(() => {
		function updateWithWindowSize() {
	      	setHasScrollBar({ bodyHeight: document.body.clientHeight, windowHeight: window.innerHeight})
	    }
	    window.addEventListener('resize', updateWithWindowSize);
	    updateWithWindowSize();
	    return () => window.removeEventListener('resize', updateWithWindowSize);
	},[])
	return hasScrollBar
}