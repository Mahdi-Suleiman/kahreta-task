const { ApolloServer, gql } = require('apollo-server')
const { PrismaClient } = require('@prisma/client')
const depthLimit = require('graphql-depth-limit')
const fs = require('fs')
const path = require('path');
const jsonwebtoken = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('./utilities')

const prisma = new PrismaClient()

const typeDefs = fs.readFileSync(
    path.join('src', 'schema.graphql'), "utf8"
)

const resolvers = {
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

            return await context.prisma.user.findMany()
        }
    },
    Mutation: {
        post: async (parent, args, context, info) => {
            const { userId } = context // return an exception if it's not found
            if (!userId) {
                throw new Error('not authorized')
            }
            const newPost = await context.prisma.post.create({
                data: {
                    title: args.title,
                    description: args.description,
                    User: { connect: { id: userId } }
                }
            })

            return newPost
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
        },
    }
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
    introspection: 'development'
});
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url} 🚀`);
});