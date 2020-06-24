import ApolloClient  from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import ApolloClient, {createNetworkInterface} from 'apollo-client'

// const server = "http://shoppingjunction.pythonanywhere.com/graphql/"
const server ="http://localhost:8000/graphql/";
// const networkinterface = createNetworkInterface({
//   //uri:'http://localhost:8000/graphql/',
//   uri:server,
// })


// networkinterface.use([
//   {
//     applyMiddleware(req, next) {
//       if (!req.options.headers) {
//         req.options.headers = {}
//       }

//       const token = localStorage.getItem('token')
//         ? localStorage.getItem('token')
//         : null
//       req.options.headers['authorization'] = `JWT ${token}` 
//       next()
//     },
//   },
// ])


// const client = new ApolloClient({
//   //link:networkinterface
//   networkInterface:networkinterface,
  
//   cache : new InMemoryCache(),
// })


// export default client



const httpLink = createHttpLink({
    uri:server,
    credentials: 'same-origin'
  });
  
  const authLink = setContext((_, { headers }) => {
    operation.setContext({
      headers: {
        authorization: token ? `Bearer sdfsdf` : ''
      }
    });
    return forward(operation);

  });
const client = new ApolloClient({
    // link: authLink.concat(httpLink),
    uri:server,
    cache : new InMemoryCache(),
})


export default client


// import { ApolloClient } from 'apollo-client';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { HttpLink } from 'apollo-link-http';
// import fetch from 'isomorphic-unfetch';

// export default function createApolloClient(initialState, ctx) {
//     // The `ctx` (NextPageContext) will only be present on the server.
//     // use it to extract auth headers (ctx.req) or similar.
//     return new ApolloClient({
//         ssrMode: Boolean(ctx),
//         link: new HttpLink({
//             uri: 'http://shoppingjunction.pythonanywhere.com/graphql/', // Server URL (must be absolute)
//             credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
//             fetch,
//         }),
//         cache: new InMemoryCache().restore(initialState),
//     });
// }



// import { ApolloLink } from "apollo-link";
// import { createHttpLink, HttpLink } from "apollo-link-http";

// const httpLink = createHttpLink({ uri: "http://shoppingjunction.pythonanywhere.com/graphql/" });
// const middlewareLink = new ApolloLink((operation, forward) => {
//   operation.setContext({
//     headers: {
//       authorization: localStorage.getItem("token") || null
//     }
//   });
//   return forward(operation);
// });

// // use with apollo-client
// const link = middlewareLink.concat(httpLink);
// client = ApolloClient({
//   link:httpLink,
//   cache:new InMemoryCache()

// })
// export default client;