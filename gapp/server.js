const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = require('graphql')

const cors = require('cors')

const  { dbConnect }  = require('./db')

const { User, Post } = require('./models')

const app = express()

dbConnect();

app.use(cors())

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'User Posts',
    fields: () => ({
            userId:{ type: GraphQLNonNull(GraphQLInt) } ,
            title:{ type: GraphQLNonNull(GraphQLString) },
            body: { type: GraphQLNonNull(GraphQLString) }
        })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User info',
    fields: () => ({
            userId:{ type: GraphQLNonNull(GraphQLInt) } ,
            name:{ type: GraphQLNonNull(GraphQLString) },
            posts: {
                type: GraphQLList(PostType),
                description: 'List all user posts',
                resolve: async (user) => {
                    const posts = await Post.find({userId: user.userId})
                    return posts
                }
            }
        })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: {
        posts: {
            type: new GraphQLList(PostType),
            description: 'List of All Posts',
            resolve: async () => {
                const posts = await Post.find({});
                return posts
         }
        },
        users: {
            type: new GraphQLList(UserType),
            description: 'List of All Users',
            resolve: async () => {
                const users = await User.find({});
                return users
            }
        },
        post: {
            type: PostType,
            description: 'Single Post',
            args: {
                title: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => {
                const post = await Post.findOne({title: args.title})
                return post
            }
        },
        user: {
            type: UserType,
            description: 'Single User',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => {
                const user = await User.findOne({name: args.name})
                return user
            }
        }
    }
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addUser: {
            type: UserType,
            description: 'Add an user',
            args: {
                userId: { type: GraphQLNonNull(GraphQLInt) },
                name: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => {
                const queryUser = { userId: args.userId, name: args.name }
                const user = new User(queryUser);
                await user.save()
                return queryUser
            }
        },
        addPost: {
            type: PostType,
            description: 'Add a post',
            args: {
                userId: { type: GraphQLNonNull(GraphQLInt) },
                title: { type: GraphQLNonNull(GraphQLString) },
                body: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => {
                const queryPost = { userId: args.userId, title: args.title, body: args.body }
                const post = new Post(queryPost);
                await post.save()
                return queryPost
            }
        }
})
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})


app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))



app.listen(4000, () => console.log('Server is running.'))

