import styled from 'styled-components'
import TopBar from '../components/TopBar'
import AllProducts from '../components/AllProducts'
import { initializeApollo } from '../lib/apolloClient'
import { CURRENT_USER_QUERY } from '../hooks/useUser'

const IndexPageLayout = styled.div`
	width: 100%;
	height: 100%;
`

export default function index({ res }) {
	// console.log(res)
	return (
		<IndexPageLayout>
			<AllProducts/>
		</IndexPageLayout>
	)
}

// export async function getServerSideProps() {
// 	const client = initializeApollo()
// 	const res = await client.query({ query: CURRENT_USER_QUERY })
// 
//   return { props: { res } };
// }