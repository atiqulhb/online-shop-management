import Link from 'next/link'
import styled from 'styled-components'
import { useLocalState } from '../components/LocalState'

const LinkSpan = styled.span`
	text-decoration: underline;
	cursor: pointer;
`

export default function NotificationMessage({ textBeforeLink, pageLink, linkText, textAfterLink }) {
	const { notification, setNotification } = useLocalState()
	return (
		<span><span>{textBeforeLink}</span> <Link href={pageLink}><LinkSpan onClick={() => setNotification({...notification, open: false })}>{linkText}</LinkSpan></Link> <span>{textAfterLink}</span></span>
	)
}