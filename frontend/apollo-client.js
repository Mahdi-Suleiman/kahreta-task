import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie'

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/',
});
// const h = setContext()
const authLink = setContext((req, { headers }) => {
    // get the authentication token from local storage if it exists
    // const token = JSON.parse(localStorage.getItem('token'))
    // const token = ''
    const token = Cookies.get('access_token')
    console.log('token', token)
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    // uri: "http://localhost:4000/",
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;