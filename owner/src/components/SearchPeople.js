import { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { gql, useQuery, useLazyQuery, useSubscription } from '@apollo/client'
import { useAuth } from './AuthState'

const SEARCH_PEOPLE = gql`
	query SEARCH_PEOPLE ($searchTerm: String!) {
		allUsers(where: {
			OR: [
				{ name_contains_i: $searchTerm }
				{ email_contains_i: $searchTerm }
			]
		}){
			id
			name
		}
	}
`

const SearchPeopleStyle = styled.div`
	width: calc(100% - 20px);
	height: calc(100% - 10px);
	position: relative;
`

const Input = styled.input`
	width: 100%;
	height: 100%;
	border-radius: 50px;
	box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.25);
	border: none;
	padding: 0 10px;
	&:focus {
		outline: none;
	}
`

const Result = styled.div`
	margin-top: 10px;
	width: 100%;
	height: auto;
	background-color: #fff;
	box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.25);
	border-radius: 10px;
	z-index: 999999999;
	position: absolute;
	ul {
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		list-style-type: none;
		li {
			border-bottom: .25px solid rgba(0,0,0,0.25);
			width: 100%;
			text-align: center;
			cursor: pointer;
			overflow: hidden;
			padding: 7.5px 0;
			&:hover {
				background-color: yellowgreen;
			}
			&:first-child {
				border-top-left-radius: 10px;
				border-top-right-radius: 10px

			}
			&:last-child {
				border: none;
				border-bottom-left-radius: 10px;
				border-bottom-right-radius: 10px;
			}
		}
	}
`

export default function SearchPeople({ setPartner }) {
	const { user } = useAuth()
	const [appear, setAppear] = useState(false)
	const [search, { data }] = useLazyQuery(SEARCH_PEOPLE)

	useEffect(() => {
	    const ResultRef = document.getElementById("result")
	    console.log(ResultRef)
		document.addEventListener('click', function(e) {
			// console.log(ResultRef)
			if (ResultRef) {
		  		if (!ResultRef.contains(e.target)) {
		    		setAppear(false)
				}
			}
		})
	},[])

	async function handleChange(e) {
		const { value } = e.target
		if (value !== '') {
			setAppear(true)
			const res = await search({ variables: { searchTerm: value }})
			// console.log(res)
		}
		else {
			setAppear(false)
		}
	}

	function handleClick(id) {
		setPartner && setPartner(id)
	}


	let u = data?.allUsers?.filter(x => x.id !== user?.id)

	// console.log(u?.length)

	return (
		<SearchPeopleStyle>
			<Input type="text" onChange={handleChange}/>
			{ appear ? (
				<Result id="result">
					<ul>
						{ u?.map(({ id, name }) => (
							<li onClick={() => handleClick(id)} key={id}>{name}</li>
						))}
					</ul>
				</Result>
			) : null }
		</SearchPeopleStyle>

	)
}