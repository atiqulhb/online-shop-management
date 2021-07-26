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
    }
`

const Children = styled.div`
	width: 100%;
	padding-left: 7px;
`

export default function ScrollBarContainer({ children, childrenStyle }) {
	return (
		<ScrollBarContainerWapper>
			<Children>{children}</Children>
		</ScrollBarContainerWapper>
	)
}