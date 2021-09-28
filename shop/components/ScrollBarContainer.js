import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useLocalState } from './LocalState'

const ScrollBarContainerWapper = styled.div`
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	overflow-y: scroll;
	&::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 7px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, .5);
      /*-webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);*/
    }
`

const Children = styled.div`
	/*width: calc(100% - 7px);*/
	width: 100%;
	padding-left: 7px;
`

export default function ScrollBarContainer({ children, childrenStyle }) {
	const { setScrollingTo } = useLocalState()
	const ScrollRef = useRef()
	useEffect(() => {
		let oldScrollTop = 0
		ScrollRef.current.onscroll = function(e) {
			setScrollingTo(oldScrollTop < e.target.scrollTop)
			oldScrollTop = e.target.scrollTop
		}
	},[setScrollingTo])

	return (
		<ScrollBarContainerWapper ref={ScrollRef} >
			<Children style={childrenStyle}>{children}</Children>
		</ScrollBarContainerWapper>
	)
}