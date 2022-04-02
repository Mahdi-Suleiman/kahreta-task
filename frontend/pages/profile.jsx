import React from 'react'
import client from '../apollo-client'
import { ApolloClient, InMemoryCache, createHttpLink, gql } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

// import { gql } from '@apollo/client'

export default function Profile({ followers }) {
    // console.log(followers[0].userId.id)
    const empty = !Boolean(followers.length)
    // console.log(empty)
    if (!empty)
        return (
            <>
                <div>Profile</div>
                <div className='container'>
                    <div className="row">
                        <h3>followers:</h3>
                        {
                            followers.map(follower =>
                                // { console.log(follower.followerId.name) }
                                <div key={follower.followerId.id} className="card m-3" style={{ width: 18 + 'rem' }}>
                                    <div className="card-body">
                                        <h5 className="card-title">{follower.followerId.name}</h5>
                                        <p className="card-text">{follower.followerId.email}</p>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </>
        )
    else
        return (
            <>
                <h1>you have no follwers yet</h1>
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
                query Followers {
                    followers {
                        # id
                        # userId {
                        # id
                        # name
                        # email
                        # }
                        followerId {
                          id
                          name
                        email
                        }
                    }
                }
  `,
    })
    // console.log(data.followers)
    return {
        props: {
            followers: data.followers
        }
    }
}
