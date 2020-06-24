
import 'bulma/css/bulma.css'
import '../components/sidebar.css'
import '../components/main.css'
import { Provider } from 'react-redux'
import rootReducer from '../redux_function/reducers'
import withRedux from "next-redux-wrapper";
import {createStore} from 'redux'
import App from 'next/app'
import {store} from '../redux_function/stores'
import { library } from '@fortawesome/fontawesome-svg-core'
// import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons'
import { ApolloProvider } from 'react-apollo'
import client from '../lib/apolloClient'


library.add(faCheckSquare,faCoffee)

// const store = createStore(rootReducer,{"products":[]})
// const makeStore = () => store;
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
function MyApp({ Component, pageProps }) {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}> 
          <Component {...pageProps} />
        </Provider>
      </ApolloProvider>
    )

  }
  const makeStore = () => store;
  export default withRedux(makeStore)(MyApp)
  // export default MyApp



// const store = createStore(rootReducer)

// class MyApp extends App {

//   static async getInitialProps({Component, ctx}) {
//       const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

//       //Anything returned here can be accessed by the client
//       return {pageProps: pageProps};
//   }

//   render() {
//       //pageProps that were returned  from 'getInitialProps' are stored in the props i.e. pageprops
//       const {Component, pageProps, store} = this.props;

//       return (
//           <Provider store={store}>
//               <Component {...pageProps}/>
//           </Provider>
//       );
//   }
// }

// //makeStore function that returns a new store for every request
// const makeStore = () => store;

// //withRedux wrapper that passes the store to the App Component
// export default withRedux(makeStore)(MyApp);


