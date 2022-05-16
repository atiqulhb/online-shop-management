const { Text } = require('@keystonejs/fields')

// exports.schemas = {
//     User: {
//         fields: {
//             name: { type: Text }
//         }
//     },
//     Product: {
//         fields: {
//             title: { type: Text }
//         }
//     }
// }

exports.schemas = [
    [ 'User', {
        fields: {
            name: { type: Text }
        }
    }],
    [ 'Product', {
        fields: {
            title: { type: Text }
        }
    }]
]