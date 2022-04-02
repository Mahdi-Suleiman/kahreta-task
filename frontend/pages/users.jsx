import React from 'react'
import { ApolloClient, InMemoryCache, createHttpLink, gql } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import client from '../apollo-client';

export default function Users({ users }) {
    console.log(users)

    const handleFollow = async (e, userId, username) => {
        e.preventDefault()
        console.log(userId)
        const response = await client.mutate({
            mutation: gql`
            mutation Follow($followerId: ID!) {
                follow(followerId: $followerId) {
                    id
                    # userId {
                    #   id
                    # }
                    # followerId {
                    #   id
                    # }
                }
            }
            `,
            variables: {
                followerId: userId
            }

        })
        console.log(response)
        if (response.data) {
            alert(`you followed ${username}`)
        }
        else {
            alert('ops, something wrong happened')
        }
    }
    return (
        <>
            <div>Users</div>
            <div className='container'>
                <div className="row">
                    {
                        users.map(user =>
                            <form action="" style={{ display: 'inline-block', width: 30 + '%' }}>

                                <div key={user.id} className="card m-3" style={{ width: 18 + 'rem' }}>
                                    <div className="card-body">
                                        <h5 className="card-title">{user.name}</h5>
                                        <p className="card-text">{user.email}</p>
                                        <button className="btn btn-primary" onClick={() => handleFollow(event, user.id, user.name)}>follow</button>
                                    </div>
                                </div>
                            </form>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps({ req, res }) {


    const httpLink = createHttpLink({
        // uri: 'http://localhost:4000/',
        uri: 'http://9f51-188-247-65-132.ngrok.io',
    });
    const authLink = setContext((_, { headers }) => {
        const token = req.cookies.access_token
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "",
            }
        }
    });

    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });

    const { data } = await client.query({
        query: gql`
                query Users {
                        users {
                            id
                            name
                            email
                            # followers {
                            #   followerId {
                            #     # id
                            #     name
                            #   }
                            # }
                            # following {
                            #   userId {
                            #     name
                            #   }
                            # }
                        }
                    }
  `,
    })

    return {
        props: {
            users: data.users
        }
    }
}
