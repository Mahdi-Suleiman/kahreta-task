import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ApolloClient, InMemoryCache, createHttpLink, gql } from "@apollo/client";
import client from '../../apollo-client';

export default function PostDetails() {
    // const router = useRouter()
    // const { pid } = router.query
    // const [postId, setPostId] = useState(pid)
    const [views, setViews] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const postId = window.location.href.split('/').pop(); // get post id before build
        // setPostId(last)
        // console.log(last)
        // setPostId(pid)
        fetchData(postId)
    }, [])

    async function fetchData(postId) {
        setLoading(true)
        const response = await client.query({
            query: gql`
           query Views($postId: ID!) {
                views(postId: $postId) {
                    userId {
                    id
                    name
                    }
                }
            }
  `,
            variables: {
                postId: postId,
            }
        })
        setViews(response.data.views)
        console.log(response.data.views)
        setLoading(false)
    }



    return (
        <>
            <div className="container">
                <div className="row">
                    <h2>viewers :</h2>
                    {/* <div>{postId}</div> */}
                    {
                        // (views && views.length) &&

                        !views.length ?
                            loading ?
                                <h2>...loading</h2>
                                :
                                <h1>no views for this post yet</h1>
                            :
                            views.map(view =>
                                <div key={view.userId.id} className="card m-3" style={{ width: 18 + 'rem' }}>
                                    <div className="card-body">
                                        <h5 className="card-title">{view.userId.name}</h5>
                                        {/* <p className="card-text">{user.email}</p> */}
                                        {/* <button className="btn btn-primary m-1" onClick={() => handleFollow(event, user.id, user.name)}>follow</button> */}
                                        {/* <button className="btn btn-danger m-1" onClick={() => handleUnfollow(event, user.id, user.name)}>Unfollow</button> */}
                                    </div>
                                </div>
                            )
                    }
                </div>
            </div>
        </>
    )
}
