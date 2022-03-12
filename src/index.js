// const { ApolloServer, gql } = require('apollo-server')
const { ApolloServer, makeExecutableSchema, gql } = require('apollo-server');
// const { ApolloServer, makeExecutableSchema, gql, GraphQLUpload } = require("apollo-server-express");
const { PrismaClient } = require('@prisma/client')
const depthLimit = require('graphql-depth-limit')
const fs = require('fs')
const path = require('path');
const jsonwebtoken = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('./utilities')
const { GraphQLUpload } = require('graphql-upload')

const { createWriteStream } = require("fs"); // this is node built in package
const { parse, join } = require("path"); // This is node built in package



const prisma = new PrismaClient()

let typeDefs = fs.readFileSync(
    path.join('src', 'schema.graphql'), "utf8"
)

// const typeDefs = gql`
// # scalar Upload 
// type File {
//     filename: String!
//     mimetype: String!
//     encoding: String!
//   }
// type Query {
//     users: [User!]!
//     feed(filter: String, skip: Int, take: Int, orderBy: PostOrderByInput): [Post!]!
// }

// type Mutation{
//     signup(email: String!, password: String!, name: String!): AuthPayload
//     login(email: String!, password: String!): AuthPayload
//     post(title: String!, description: String!): Post!
//     like(postId: ID!): Like
//     view(postId: ID!): View
// singleUpload(file: Upload!): File!

// }


// type Like{
//     id: ID!
//     postId: Post!
//     userId: User!
// }

// type User{
//     id: ID!
//     name: String!
//     email: String!
//     posts: [Post!]!
//     views: [View!]!
// }

// type View{
//     id: ID!
//     userId: User!
//     postId: Post!
// } 

// type Post {
//     id: ID!
//     description: String!
//     title: String!
//     userId: User!
//     likes: [Like!]!
//     views: [View!]!
// }

// type AuthPayload{
//     token: String
//     user: User
// }

// input PostOrderByInput {
//   description: Sort
//   title: Sort
//   createdAt: Sort
// }

// enum Sort {
//   asc
//   desc
// }
// `
console.log(GraphQLUpload)
const resolvers = {
    // Upload: GraphQLUpload,
    Query: {
        feed: async (parent, args, context, info) => {
            const { userId } = context // return an exception if no token found

            if (!userId) {
                throw new Error('not authorized')
            }
            const where = args.filter ?
                {
                    OR: [
                        { description: { contains: args.filter } },
                        { title: { contains: args.filter } },
                    ],
                }
                : {}

            if (args.take > 1000) {
                let take = 1000
            }
            //filtering, pagination & sorting
            const posts = await context.prisma.post.findMany({
                where,
                skip: args.skip,
                take: args.take,
                orderBy: args.orderBy
            })
            return posts
        },
        users: async (parent, args, context, info) => {
            const { userId } = context // return an exception if no token found

            if (!userId) {
                throw new Error('not authorized')
            }

            return await context.prisma.user.findMany({
                where: {
                    userId: userId
                }
            })
        },
        // followers: async (parent, args, context, info) => {
        //     const { userId } = context // return an exception if no token found

        //     if (!userId) {
        //         throw new Error('not authorized')
        //     }

        //     return await context.prisma.follower.findMany({
        //         where: {
        //             userId: userId
        //         }
        //     })

        // }
    },
    Mutation: {
        post: async (parent, args, context, info) => {
            const { userId } = context // return an exception if it's not found
            if (!userId) {
                throw new Error('not authorized')
            }
            // console.log(args.description.includes('war'))
            const descriptionCheck = /war|gender|terrorist/.test(args.description)
            // console.log(/war|gender|terrorist/.test(args.description))
            if (descriptionCheck) {
                throw new Error(`Post cannot contain offensive words like: war, gender & terrorist`)
            }

            // const newPost = await context.prisma.post.create({
            //     data: {
            //         title: args.title,
            //         description: args.description,
            //         User: { connect: { id: userId } }
            //     }
            // })

            // return newPost
        },
        signup: async (parent, args, context, info) => {
            const passwordCheck = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(args.password);
            const emailCheck = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(args.email)
            if (!emailCheck) {
                throw new Error('not a valid email')
            }
            if (!passwordCheck) {
                throw new Error('password must contain at least be 8 characters, at least one letter and one number')
            }
            const newUser = await context.prisma.user.create({
                data: {
                    name: args.name,
                    email: args.email,
                    password: args.password
                }
            })

            const token = jsonwebtoken.sign({ userId: newUser.id }, APP_SECRET)
            console.log(newUser)

            return {
                token,
                newUser,
            }
            // return newUser
        },
        login: async (parent, args, context, info) => {
            const user = await context.prisma.user.findUnique({
                where: {
                    email: args.email,
                },
            })
            if (!user) {
                throw new Error('User not found')
            }

            if (user.password !== args.password) {
                throw new Error('Wrong Password')
            }

            const token = jsonwebtoken.sign({ userId: user.id }, APP_SECRET)

            return {
                token,
                user
            }
        },
        like: async (parent, args, context, info) => {
            const { userId } = context

            const likeCheck = await context.prisma.like.findUnique({
                where: {
                    userId_postId: {
                        userId: String(userId),
                        postId: String(args.postId),
                    }
                }
            })
            if (Boolean(likeCheck)) {
                throw new Error(`Already liked this post ${args.postId}`)
            }

            const newLike = await context.prisma.like.create({
                data: {
                    User: { connect: { id: userId } },
                    Post: { connect: { id: args.postId } },
                }
            })

            return newLike
        },
        view: async (parent, args, context, info) => {
            const { userId } = context // return an exception if it's not found
            if (!userId) {
                throw new Error('not authorized')
            }
            const viewCheck = await context.prisma.like.findUnique({
                where: {
                    userId_postId: {
                        userId: String(userId),
                        postId: String(args.postId),
                    }
                }
            })

            if (Boolean(viewCheck)) {
                throw new Error(`User already viewd this post ${args.postId}`)
            }

            const newView = await context.prisma.view.create({
                data: {
                    User: { connect: { id: String(userId) } },
                    Post: { connect: { id: String(args.postId) } },
                }
            })

            return newView
        },
        singleUpload: async (parent, args, context, info) => {
            const { file } = args
            const { createReadStream, filename, mimetype, encoding } = await file
            const stream = createReadStream()
            const pathName = path.join(__dirname, `../uploads/${filename}`)
            await stream.pipe(fs.createWriteStream(pathName))
            // console.log(await args.file.filename)
            // const { filename, createReadStream } = await args.file;
            // // console.log(filename)
            // const stream = createReadStream();
            // // const stream = fs.createReadStream();
            // // // console.log(createReadStream)
            // const imagePath = join(__dirname, `../uploads/${filename}`)
            // // console.log(imagePath)
            // const imageStream = await createWriteStream(imagePath)
            // await stream.pipe(imageStream)



            // await stream.pipe(imageStream)
            //
            // const { createReadStream, filename } = await file;
            // const stream = createReadStream();
            // name = `single${Math.floor((Math.random() * 10000) + 1)}`;
            // let url = join(__dirname, `../Upload/${name}-${Date.now()}${ext}`);
            // const imageStream = await createWriteStream(url)
            // await stream.pipe(imageStream);

            // const baseUrl = process.env.BASE_URL || "http://localhost:"
            // const port = process.env.PORT || 4000
            // url = `${baseUrl}${port}${url.split('Upload')[1]}`;
            // return url;
            //


            return args.file.then(file => {
                //Contents of Upload scalar: https://github.com/jaydenseric/graphql-upload#class-graphqlupload
                //file.createReadStream() is a readable node stream that contains the contents of the uploaded file
                //node stream api: https://nodejs.org/api/stream.html
                // console.log(file.createReadStream)
                // console.log(await args.file.filename)
                // const { filename, createReadStream } = await args.file;
                // console.log(filename)
                // const stream = file.createReadStream().pipe(
                //     createWriteStream(
                //         path.join(__dirname, "../uploads/", file.filename)
                //     )
                // );
                // const stream = fs.createReadStream();
                // // console.log(createReadStream)
                // const imagePath = join(__dirname, `../uploads/`, file.filename)
                // console.log(imagePath)
                // const imageStream = createWriteStream(imagePath)
                // stream.pipe(imageStream)

                return file;
            });

        },
        follow: async (parent, args, context, info) => {
            const { userId } = context // return an exception if it's not found
            if (!userId) {
                throw new Error('not authorized')
            }

            const followCheck = await context.prisma.follower.findUnique({
                where: {
                    userId_followerId: {
                        userId: String(userId),
                        followerId: String(args.followerId),
                    }
                }
            })
            if (Boolean(followCheck)) {
                throw new Error(`user with ID ${userId} already followerd user with ID ${args.followerId}`)
            }

            const newFollow = await context.prisma.follower.create({
                data: {
                    User: { connect: { id: userId } },
                    Follower: { connect: { id: args.followerId } }
                }
            })

            return newFollow
        }
    },
    Post: {
        id: (parent, args, context, info) => parent.id,
        description: (parent, args, context, info) => parent.description,
        title: (parent, args, context, info) => parent.title,
        userId: async (parent, args, context) => {
            return await context.prisma.post.findUnique({ where: { id: parent.id } }).User()
        },
        likes: async (parent, args, context) => {
            return await context.prisma.post.findUnique({ where: { id: parent.id } }).likes()
        },
        views: async (parent, args, context, info) => {
            return await context.prisma.post.findUnique({ where: { id: parent.id } }).views()
        }
    },
    User: {
        posts: async (parent, args, context, info) => {
            return await context.prisma.user.findUnique({ where: { id: parent.id } }).posts()
        },
        views: async (parent, args, context, info) => {
            return await context.prisma.post.findUnique({ where: { id: parent.id } }).views()
        }
    },
    Like: {
        postId: async (parent, args, context, info) => {
            return await context.prisma.like.findUnique({ where: { id: parent.id } }).Post()
        },
        userId: async (parent, args, context, info) => {
            return await context.prisma.like.findUnique({ where: { id: parent.id } }).User()
        },
    },
    View: {
        postId: async (parent, args, context, info) => {
            return await context.prisma.view.findUnique({ where: { id: parent.id } }).Post()
        },
        userId: async (parent, args, context, info) => {
            return await context.prisma.view.findUnique({ where: { id: parent.id } }).User()
        }
    },
    // Follow: {
    //     id: async (parent, args, context, info) => {
    //         return parent.id
    //         return await context.prisma.follower.findUnique({ where: { id: parent.id } }).id()
    //     },
    //     userId: async (parent, args, context, info) => {
    //         return await context.prisma.follower.findUnique({ where: { id: parent.id } }).User()
    //     },
    //     followerId: async (parent, args, context, info) => {
    //         return await context.prisma.follower.findUnique({ where: { id: parent.id } }).Follower()
    //     }
    // }
}


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            userId:
                req && req.headers.authorization
                    ? getUserId(req)
                    : null
        }
    },
    validationRules: [depthLimit(3)],
    introspection: 'development',
    // uploads: false
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url} 🚀`);
});








// const { parse, join } = require("path"); // This is node built in package
// const { createWriteStream } = require("fs"); // this is node built in package

const readFile = async (file) => {
    const { createReadStream, filename } = await file;
    const stream = createReadStream();
    var { ext, name } = parse(filename);
    name = `single${Math.floor((Math.random() * 10000) + 1)}`;
    let url = join(__dirname, `../Upload/${name}-${Date.now()}${ext}`);
    const imageStream = await createWriteStream(url)
    await stream.pipe(imageStream);
    const baseUrl = process.env.BASE_URL || "http://localhost:"
    const port = process.env.PORT || 4000
    url = `${baseUrl}${port}${url.split('Upload')[1]}`;
    return url;
} // This is single readfile