import { useRef, useEffect } from 'react'
import styled from 'styled-components'

const ScrollBarWapper = styled.div`
	width: 100%;
	height: 100%;
	overflow-y: scroll;
	&::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 7px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, .5);
      -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
    }
`

const Children = styled.div`
	width: calc(100% - 7px);
	width: 100%;
	padding-left: 7px;
`

export default function ScrollBar({ children }) {
	const ScrollBarRef = useRef()
	useEffect(() => {
		ScrollBarRef.current.scrollTop = ScrollBarRef.current.scrollHeight
	},[])
	return (
		<ScrollBarWapper ref={ScrollBarRef}>
			<Children>{children}</Children>
		</ScrollBarWapper>
	)
}