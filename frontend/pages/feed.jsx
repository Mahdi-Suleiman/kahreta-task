import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import axios from 'axios'
import { ApolloClient, InMemoryCache, createHttpLink, gql } from "@apollo/client";
import client from '../apollo-client';
import { setContext } from '@apollo/client/link/context';
import Image from 'next/image'
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'
import Link from 'next/link'

// const [first, setfirst] = useState(2)

// let pageCounter = 5
export default function Feed(
    // { feed }
    { key }
) {
    const router = useRouter();
    // const [feeed, setFeeed] = useState(feed)
    // const [feeed, setFeeed] = useState([])
    const [cookie, setCookie] = useState(Cookies.get('access_token'))
    // console.log(feeed)


    const [myFeed, setMyFeed] = useState([])
    const [counter, setCounter] = useState(0)

    const [customFeed, setCustomFeed] = useState([])
    const [followingList, setFollowingList] = useState([])
    const [followingIDs, setFollowingIDs] = useState([])
    // useEffect(() => {
    //     // const myDiv = document.querySelector('#scrollDiv')
    //     const myDiv = document.querySelector('main')
    //     myDiv.addEventListener('scroll', () => {
    //         console.log('test')
    //         if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
    //             console.log('scrolled to bottom')
    //         }
    //     })
    // })
    // useEffect(() => {
    //     getFollowingList().then(data => setFollowingList(data)).then(action => {

    //         let onlyIDs = []
    //         followingList.forEach(following => {
    //             onlyIDs.push(following.userId.id)
    //             // setFollowingIDs([...followingIDs, following.userId.id])
    //             console.log('only ids', onlyIDs)
    //         })
    //         setFollowingIDs(onlyIDs)
    //     })

    // }, [])
    useEffect(() => {
        getData().then(data => setMyFeed(data))
        getFollowingList().then(data => setFollowingList(data))

        let onlyIDs = []
        followingList.forEach(following => {
            onlyIDs.push(following.userId.id)
            // setFollowingIDs([...followingIDs, following.userId.id])
            console.log('only ids', onlyIDs)
        })
        setFollowingIDs(onlyIDs)
        // getFollowingList().then(data => setFollowingList(data))
        // getData()
        // setMyFeed()
        // getFollowingIDs()

        // console.log('my feed', myFeed)
        const posts = []
        const bulkedFeed = myFeed.map(post =>
            followingList.map(following => {
                if (post.userId.id == following.userId.id) {
                    // return post
                    // posts.push(post)
                    // console.log(post)
                    // console.log('follow id', following.userId.id)
                    // console.log('poster id', post.userId.id)
                    setCustomFeed([...customFeed, post])
                    // console.log('customFeed', customFeed)
                }
            })
        )
        // console.log('bulked', bulkedFeed)

    }, [counter])
    // console.log(myFeed)

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

    async function getData() {
        const response = await client.query({
            query: gql`
            # query Feed($take: Int, $skip: Int) {
            #         feed(take: $take, skip: $skip) {
                query Feed($take: Int, $skip: Int, $orderBy: PostOrderByInput) {
                feed(take: $take, skip: $skip, orderBy: $orderBy) {
                        id
                        description
                        title
                        image_url
                        userId {
                            id
                        }
                }
            }
  `,
            variables: {
                take: counter,
                skip: 0,
                orderBy: {
                    createdAt: "desc"
                }
            }
        })
        return response.data.feed
        // .then(res => {
        //     console.log(res.data.feed)
        //     setMyFeed(res.data.feed)
        // })
        // console.log(response)
        // setMyFeed(response)
    }

    async function getFollowingList() {
        const response = await client.query({
            query: gql`
            # query Feed($take: Int, $skip: Int) {
            #         feed(take: $take, skip: $skip) {
                query Followeing {
                    following {
                        userId {
                        id
                        name
                        }
                    }
                }
  `
        })
        return response.data.following
        // .then(res => {
        //     console.log(res.data.feed)
        //     setMyFeed(res.data.feed)
        // })
        // console.log(response)
        // setMyFeed(response)
    }

    function getFollowingIDs() {
        let onlyIDs = []
        followingList.forEach(following => {
            onlyIDs.push(following.userId.id)
            // setFollowingIDs([...followingIDs, following.userId.id])
            console.log('only ids', onlyIDs)
        })
        setFollowingIDs(onlyIDs)
    }

    // const listInnerRef = useRef();
    // const handleScroll = () => {
    //     if (listInnerRef.current) {
    //         const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
    //         console.log(scrollTop, scrollHeight, clientHeight)
    //         if (scrollTop + clientHeight >= scrollHeight) {
    //             alert("reached bottom");
    //         }
    //     }
    // }

    // const myScroll = (e) => {
    //     console.log(e)
    //     console.log('hi')
    //     if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) {
    //         console.log('scrolled to bottom')
    //     }
    // }


    if (cookie) {
        if (!followingList.length) {
            return (
                <>
                    <h1>please following someone to start seeing their posts</h1>
                </>
            )
        } else {
            return (
                <div id='scrollDiv'
                // onScroll={(e) => { myScroll(e) }}
                // ref={listInnerRef}
                >
                    {/* feed */}
                    {/* {message} */}
                    {/* <MyFeed /> */}
                    {/* <br /> */}
                    <div className='container'
                    // onScroll={(e) => { myScroll(e) }}
                    >
                        <div className="row"

                        >
                            {
                                myFeed.map(post => {
                                    // { console.log(post.image_url) }
                                    // console.log(post)
                                    if (followingIDs.includes(post.userId.id)) {
                                        return (
                                            <form
                                                action=""
                                                style={{ display: 'inline-block', width: 30 + '%' }}
                                            >
                                                <div key={post.id} className="card m-3 p-1" style={{ width: 18 + 'rem' }}>
                                                    <img src={post.image_url} className="card-img-top" alt={post.description} layout='fill' />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{post.title}</h5>
                                                        <p className="card-text">{post.description}</p>
                                                        <button className="btn btn-primary m-1" onClick={(e) => { viewPost(e, post.id) }}>view post</button>
                                                        <br />
                                                        <Link href={`post/${post.id}`}>
                                                            <a className="btn btn-secondary m-1">see who viewed this post</a>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </form>
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className="row">
                            <button onClick={() => {
                                setCounter(counter + 5)
                                // const refreshData = () => {
                                //     router.replace(router.asPath);
                                // }
                                // setCounter(counter + 5)
                                // pageCounter += counter
                                // console.log("page counter", pageCounter)
                                // console.log("state counter", counter)
                                // console.log('feed length', feed.length)
                                // refreshData()
                                // setFeeed(feed)

                            }}>show more 5 posts</button>
                        </div>
                    </div>
                </div>
            )
        }
    } else {
        return (
            <>
                <h1>please login to be able post</h1>
            </>
        )
    }
}



// export async function getServerSideProps({ req, res }) {
//     // const client = new ApolloClient({
//     //     uri: `http://localhost:4000/`,
//     //     cache: new InMemoryCache()
//     // })

//     const httpLink = createHttpLink({
//         // uri: 'http://localhost:4000/',
//         uri: 'http://9f51-188-247-65-132.ngrok.io',
//     });
//     const authLink = setContext((_, { headers }) => {
//         const token = req.cookies.access_token
//         console.log('feed token', token)
//         return {
//             headers: {
//                 ...headers,
//                 authorization: token ? `Bearer ${token}` : "",
//             }
//         }
//     });

//     const client = new ApolloClient({
//         link: authLink.concat(httpLink),
//         cache: new InMemoryCache(),
//     });
//     // console.log('pagecounter befroe query', pageCounter)

//     // console.log(req.cookies.access_token)
//     const { data } = await client.query({
//         query: gql`
//             # query Feed($take: Int, $skip: Int) {
//             #         feed(take: $take, skip: $skip) {
//                 query Feed($orderBy: PostOrderByInput) {
//                     feed(orderBy: $orderBy) {
//                         id
//                         description
//                         title
//                         image_url
//                         userId{
//                             id
//                         }
//                 }
//             }
//   `,
//         variables: {
//             // take: pageCounter,
//             // skip: 0,
//             orderBy: {
//                 createdAt: "desc"
//             }
//         }
//     })

//     // console.log(data.feed)
//     return {
//         props: {
//             // feed: data.feed
//             feed: []
//         }
//     }
// }










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
