import { useState, useEffect } from 'react'
import styled from 'styled-components'

const CustomSelectWrapper = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	user-select: none;
	cursor: pointer;
	/*background-color: orange;*/
	
`

const CustomSelectInner = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 7.5px;
	/*border: 1px solid black;*/
	box-shadow: 0px 0px 0px 0.5px rgba(0, 0, 0, 0.5);
	font-size: 14px;
`

const CustomOptions = styled.ul`
	width: 100%;
	height: auto;
	list-style-type: none;
	padding: 0;
	margin: 5px 0;
	/*background-color: olive;*/
	background-color: #fff;
	position: absolute;
	border-radius: 7.5px;
	border: 1px solid black;
	box-shadow: 3px 3px 4px 0.5px rgba(0, 0, 0, 0.25);
	z-index: 99;
	font-size: 14px;
	li {
		border-bottom: 1px solid black;
		text-align: center;
		padding: 5px 0;
		cursor: pointer;
		&:hover {
			background-color: gold;
		}
		&:last-child {
			border: none;
		}
	}
`

export default function CustomSelect({ style, options, header, onSelect, name }) {
	const [customSelectConfig, setCustomSelectConfig] = useState({
		activation: false,
		value: header,
		header: header,
		name: name,
	})
	useEffect(() => {
		if(header) {
			setCustomSelectConfig({...customSelectConfig, header: header, value: undefined})
		} else {
			if (options[0].option && options[0].value) {
				setCustomSelectConfig({...customSelectConfig, header: options[0].option, value: options[0].value })
			} else {
				setCustomSelectConfig({...customSelectConfig, header: option, value: option })
			}
		}
	},[])
	useEffect(() => {
		onSelect && onSelect({ name: name, value: customSelectConfig.value})
	},[customSelectConfig.value])
	return (
		<CustomSelectWrapper style={style}>
		{options && options[0] && options[0].option && options[0].value ? (
			<>
				<CustomSelectInner onClick={() => setCustomSelectConfig({...customSelectConfig, activation: !customSelectConfig.activation})}>{customSelectConfig.header}</CustomSelectInner>
				{customSelectConfig.activation ? (
					<CustomOptions>
						{header ? (
							<li  onClick={() => setCustomSelectConfig({...customSelectConfig, activation: false, value: undefined,  header: header })}>{header}</li>
						) : null}
						{options.map((option,key) => (
							<li key={key} onClick={() => setCustomSelectConfig({...customSelectConfig, activation: false, value: option.value, header: option.option})}>{option.option}</li>
						))}
					</CustomOptions>
				) : null}
			</>
		) : (
			<>
				<CustomSelectInner onClick={() => setCustomSelectConfig({...customSelectConfig, activation: !customSelectConfig.activation})}>{customSelectConfig.header}</CustomSelectInner>
				{customSelectConfig.activation ? (
					<CustomOptions>
						{header ? (
							<li  onClick={() => setCustomSelectConfig({...customSelectConfig, activation: false, value: undefined, header: header})}>{header}</li>
						) : null}
						{options.map((option,key) => (
							<li key={key} onClick={() => setCustomSelectConfig({...customSelectConfig, activation: false, value: option, header: option})}>{option}</li>
						))}
					</CustomOptions>
				) : null}
			</>
		)}
		</CustomSelectWrapper>
	)
}