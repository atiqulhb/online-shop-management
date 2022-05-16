import { gql, useMutation } from '@apollo/client'

const ADD_HISTORY_BOOK = gql`
    mutation ADD_HISTORY_BOOK ($title: String!, $writer: String!) {
        AddNewHistoryBook(title: $title, writer: $writer) {
            title
            writer
        }
    }
`

export default function Testing() {
    const [add] = useMutation(ADD_HISTORY_BOOK, { variables: { title: "some history book", wrtier: "some writer "}})
    return (
        <div>
            <button onClick={add}>add</button>
        </div>
    )
}