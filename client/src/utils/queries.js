import gql from 'graphql-tag';

export const GET_ME = gql`
    query me($id: ID){
        me(_id:$id){
            _id
            username
            email
            bookCount
            savedBooks
        }
    }
`