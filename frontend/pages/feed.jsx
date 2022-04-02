import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ApolloClient, InMemoryCache, createHttpLink, gql } from "@apollo/client";
import client from '../apollo-client';
import { setContext } from '@apollo/client/link/context';
import Image from 'next/image'
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'

// const [first, setfirst] = useState(2)

// let pageCounter = 5
export default function Feed({ feed }) {
    const router = useRouter();
    const [feeed, setFeeed] = useState(feed)
    const [cookie, setCookie] = useState(Cookies.get('access_token'))
    console.log(feeed)

    // console.log('posts from feed', posts);
    // console.log(posts.length);
    // posts.map(post => console.log(post))
    // console.log(feed);
    // const [counter, setCounter] = useState(10)
    // pageCounter = counter
    // useEffect(() => {

    //     setFeeed(feed)
    //     pageCounter = counter
    //     // router.push(router.asPath)
    //     // router.replace(router.asPath)
    // }, [counter])

    const viewPost = async (e, postId) => {
        e.preventDefault();
        const response = await client.mutate({
            mutation: gql`
            mutation View($postId: ID!) {
                view(postId: $postId) {
                    id
                    viewed
                }
            }
            `,
            variables: {
                postId: postId
            }
        })
        console.log(response)
        if (response.data.view.viewed) {
            alert('you already viewed this post')
        } else {
            alert('this is your first time seeing this post')
        }

    }

    if (cookie) {

        return (
            <div>
                feed
                {/* {message} */}
                {/* <MyFeed /> */}
                <br />
                <div className='container'>
                    <div className="row">
                        {
                            feeed.map(post => {
                                // { console.log(post.image_url) }
                                return (
                                    <form action="" style={{ display: 'inline-block', width: 30 + '%' }}>
                                        <div key={post.id} className="card m-3" style={{ width: 18 + 'rem' }}>
                                            <img src={post.image_url} className="card-img-top" alt={post.description} layout='fill' />
                                            <div className="card-body">
                                                <h5 className="card-title">{post.title}</h5>
                                                <p className="card-text">{post.description}</p>
                                                <button className="btn btn-primary" onClick={() => { viewPost(event, post.id) }}>view post</button>
                                            </div>
                                        </div>
                                    </form>
                                )
                            })
                        }
                    </div>
                    {/* <div className="row">
                    <button onClick={() => {
                        const refreshData = () => {
                            router.replace(router.asPath);
                        }
                        setCounter(counter + 5)
                        pageCounter += counter
                        console.log("page counter", pageCounter)
                        console.log("state counter", counter)
                        console.log('feed length', feed.length)
                        refreshData()
                        setFeeed(feed)

                    }}>show more 5</button>
                </div> */}
                </div>
            </div>
        )
    } else {
        return (
            <>
                <h1>please login to be able post</h1>
            </>
        )
    }
}





export async function getServerSideProps({ req, res }) {
    // const client = new ApolloClient({
    //     uri: `http://localhost:4000/`,
    //     cache: new InMemoryCache()
    // })

    const httpLink = createHttpLink({
        // uri: 'http://localhost:4000/',
        uri: 'http://9f51-188-247-65-132.ngrok.io',
    });
    const authLink = setContext((_, { headers }) => {
        const token = req.cookies.access_token
        console.log('feed token', token)
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
    // console.log('pagecounter befroe query', pageCounter)

    // console.log(req.cookies.access_token)
    const { data } = await client.query({
        query: gql`
            # query Feed($take: Int, $skip: Int) {
            #         feed(take: $take, skip: $skip) {
                query Feed($orderBy: PostOrderByInput) {
                    feed(orderBy: $orderBy) {
                        id
                        description
                        title
                        image_url
                        userId{
                            id
                        }
                }
            }
  `,
        variables: {
            // take: pageCounter,
            // skip: 0,
            orderBy: {
                createdAt: "desc"
            }
        }
    })

    // console.log(data.feed)
    return {
        props: {
            feed: data.feed
        }
    }
}










// export async function getStaticProps(context) {
//     const res = await axios
//         .post(`http://localhost:4000/`, {
//             query: `
//         query Feed {
//             feed {
//               id
//               description
//               title
//               image_url
//             }
//           }
// `,
//         })

//     const posts = res.data.data.feed
//     return {
//         props: { message: `Next.js is awesome`, posts: posts }, // will be passed to the page component as props
//     }
// }


// export function MyFeed() {
//     const posts = []
//     axios
//         .post(`http://localhost:4000/`, {
//             query: `
//             query Feed {
//                 feed {
//                   id
//                   description
//                   title
//                   image_url
//                 }
//               }
//     `,
//         })
//         .then(res => res)
//         .then(data => posts.push(data))
//         .catch(err => console.log(err))
//     console.log(posts);
//     return (
//         <div>{posts.map(post => post)}</div>
//     )
// }
