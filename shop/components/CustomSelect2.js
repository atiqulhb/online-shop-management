import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

const CustomSelect2Layout = styled.div`
    width: 100px;
    height: auto;
    z-index: 9999999999999;
    position: relative;
`

const Header = styled.div`
    width: 100%;
    height: 100px:
    color: white;
    position: absolute;
    text-align: center;
    border: 1px solid black;
    padding: 5px 0;
    cursor: pointer;
`

const List = styled.ul`
    width: 100%;
    height: auto;
    border: 1px solid black;
    position: absolute;
    margin: 40px 0;
    padding: 0;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    background-color: white;
    & > li {
        text-align: center;
        padding: 5px 0;
        border-bottom: 1px solid black;
        cursor: pointer;

        &:last-child {
            border: none;
        }
    }
`

const levels = [{ title: "High", value: "high" }, { title: "Medium", value: "medium" }, { title: "Low", value: "low"}]

export default function CustomSelect2() {
    const [showList, setShowList] = useState(false)
    const [selected, setSelected] = useState({
        title: '',
        value: ''
    })

    console.log(selected)

    let MainRef = useRef()

    useEffect(() => {
		document.addEventListener('click', function(e) {
			if (MainRef) {
		  		if (MainRef.current.contains(e.target)) {
		    		setShowList(true)
				} else {
                    setShowList(false)
                }
			}
		})
	},[])

    function handleSelection(title,value) {
        setSelected({ title, value })
        setShowList(false)
    }

    return (
        <CustomSelect2Layout ref={MainRef}>
            <Header>dfdf</Header>
            {showList ? (
                <List>
                    {levels.map(({ title, value },key) => (
                        <li key={key} onClick={() => handleSelection(title,value)}>{title}</li>
                    ))}
                </List> 
            ) : null}
        </CustomSelect2Layout>
    )
}