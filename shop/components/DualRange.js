import { useState, useEffect } from 'react'
import styled from 'styled-components'

const DualRangeLayout = styled.div`
	width: 100%;
	display: flex;
`

const ValueField = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
`

const SpaceForDualRange = styled.div`
	flex: 8;
	display: flex;
	justify-content: center;
	align-items: center;
`

const DualRangeInput = styled.div`
	width: 100%;
	position: relative;
   	height: 75px;
	input {
		position: absolute;
		box-sizing: border-box;
		appearance: none;
		width: 90%;
		height: 40px;
		/*height: -200px;*/
		margin: 0 auto;
		left: 5%;
		padding: 0 3px;
		/* Add some L/R padding to ensure box shadow of handle is shown */
		overflow: hidden;
		border: 0;
		border-radius: 1px;
		outline: none;
		background: linear-gradient(grey, grey) no-repeat center;
		/* Use a linear gradient to generate only the 2px height background */
		background-size: 90% 2px;
		pointer-events: none;
		margin: 18px 0;
		&:active,
		&:focus {
		  	outline: none;
		}
		&.active {
			&::-webkit-slider-thumb {
				z-index: 99;
			}
			&&::-moz-range-thumb {
				z-index: 99;
			}
		}
		&::-webkit-slider-thumb {
			height: 28px;
			width: 28px;
			border-radius: 28px;
			background-color: #fff;
			position: relative;
			/*margin: 15px 0;*/
			margin: 5px 0;
			/* Add some margin to ensure box shadow is shown */
			cursor: pointer;
			appearance: none;
			pointer-events: all;
			box-shadow: 0 1px 4px 0.5px rgba(0, 0, 0, 0.25);
			/*
			&::before {
			    content: ' ';
			    display: block;
			    position: absolute;
			    top: 13px;
			    left: 100%;
			    width: 2000px;
			    height: 2px;
			}
			*/
		}
		&::-moz-range-thumb {
			height: 28px;
			width: 28px;
			border-radius: 28px;
			background-color: #fff;
			position: relative;
			margin: 15px 0;
			/* Add some margin to ensure box shadow is shown */
			cursor: pointer;
			appearance: none;
			pointer-events: all;
			box-shadow: 0 1px 4px 0.5px rgba(0, 0, 0, 0.25);
		}
		&:nth-child(1) {
		 	&::-webkit-slider-thumb::before {
		    	background-color: red;
		 	}
		 	&::-moz-range-thumb::before {
		 		background-color: red;
		 	}
		}
		&:nth-child(2) {
         	background: none;
         	&::-webkit-slider-thumb::before {
             	background-color: grey;
         	}
         	&::-moz-range-thumb::before {
             	background-color: grey; 
         	}

      	}
	}
`


export default function DualRange({ min, max, onChange }) {
	const [dualRangeData, setDualRangeData] = useState({
		minValue: undefined,
		maxValue: undefined,
	})

	const [activeRange, setActiveRange] = useState({
		input1: undefined,
		input2: undefined
	})

	const [inputValues, setInputValues] = useState({
		input1: min,
		input2: max
	})

	useEffect(() => {
		onChange && onChange(dualRangeData)
	},[dualRangeData])

	function OnChangePriceRanges (e) {
		const { name, value } = e.target
		setInputValues({...inputValues, [name]: parseFloat(value)})
	}

	function OnMouseUpFIlterWithPriceRange() {
		setDualRangeData({
			...dualRangeData,
			maxValue: Math.max(inputValues.input1, inputValues.input2),
			minValue: Math.min(inputValues.input1, inputValues.input2)
		})
	}
	return (
		<DualRangeLayout>
			<ValueField>{Math.min(inputValues.input1, inputValues.input2)}</ValueField>
			<SpaceForDualRange>
				<DualRangeInput>
					<input className={activeRange.input1 ? 'active' : null} onMouseDown={e => setActiveRange({ input1: true, input2: false })} type="range" name="input1" min={min} max={max} value={inputValues.input1} onChange={OnChangePriceRanges} onMouseUp={OnMouseUpFIlterWithPriceRange}/>
					<input className={activeRange.input2 ? 'active' : null} onMouseDown={e => setActiveRange({ input1: false, input2: true })} type="range" name="input2" min={min} max={max} value={inputValues.input2} onChange={OnChangePriceRanges} onMouseUp={OnMouseUpFIlterWithPriceRange}/>
				</DualRangeInput>
			</SpaceForDualRange>
			<ValueField>{Math.max(inputValues.input1, inputValues.input2)}</ValueField>
		</DualRangeLayout>
	)
}