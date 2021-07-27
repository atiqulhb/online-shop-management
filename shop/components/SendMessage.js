import styled from 'styled-components'
import { GrSend } from "react-icons/gr"

const SendButtonStyle = styled.div`
	position: absolute;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50px;
	bottom: 5px;
	right: 5px;
	cursor: pointer;
	box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.25);
	svg {
		transform: scale(1.5)
	}
`

export default function SendButton() {
	return (
		<SendButtonStyle>
			<GrSend/>
		</SendButtonStyle>
	)
}