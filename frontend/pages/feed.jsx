import React from 'react'
import axios from 'axios'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export default function Feed({ feed }) {
    // console.log('posts from feed', posts);
    // console.log(posts.length);
    // posts.map(post => console.log(post))
    // console.log(feed);
    return (
        <div>
            feed
            {/* {message} */}
            {/* <MyFeed /> */}
            <br />
            <div className='container'>
                <div className="row">
                    {
                        feed.map(post => {
                            { console.log(post.image_url) }
                            return (
                                <div key={post.id} className="card" style={{ width: 18 + 'rem' }}>
                                    <img src={post.image_url} className="card-img-top" alt="..." />
                                    <div className="card-body">
                                        <h5 className="card-title">{post.title}</h5>
                                        <p className="card-text">{post.description}</p>
                                        <a href="#" className="btn btn-primary">Go somewhere</a>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}





export async function getStaticProps() {
    const client = new ApolloClient({
        uri: `http://localhost:4000/`,
        cache: new InMemoryCache()
    })

    const { data } = await client.query({
        query: gql`
      query Feed {
          feed {
            id
            description
            title
            image_url
          }
        }
  `
    })

    console.log(data.feed)
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
