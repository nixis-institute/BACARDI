import Head from 'next/head'
import Link from 'next/link'
import {ApolloProvider} from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import client from '../lib/apolloClient';
// import Nav from './navbar';
import { withRouter } from 'next/router'
import Navbar from './navbar';
import LoadingOverlay from 'react-loading-overlay'
// import { Provider } from 'react-redux'
// import rootReducer from '../redux_function/reducers'
// import {createStore} from 'redux'

// const store = createStore(rootReducer)

class Layout extends React.Component{
    constructor(props) {
        super(props);
    }
    
    static async getInitialProps({ req }) {
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
    }
    
    

    render(){
        // const r = new Router()
        // console.log(r)
        
        // console.log(this.props.router.pathname)
        let route = this.props.router.pathname;
        const { children,active,loading,loadingText,title = "BACARDI" } = this.props;
        // const title = "Welcome to Nextjs";
        // console.log(active)
        return(
            // <Provider store={store}>

            <LoadingOverlay active={loading} spinner text={loadingText}> 

            <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
            <div>
                <Head>
                    <title>{title}</title>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                </Head>

                <header>
                    <Navbar/>
                </header>
                <main className="main">
                    <div style={{display:'flex'}}>
                        <div className="sidebar">
                            <div className="_side">
                                {/* {route} */}
                                <div className={route=="/" ||route.startsWith("/detail/")  ?"item active":"item"} >
                                <Link href="/" >
                                    <div>
                                        <h1 className="label" >Product</h1>
                                    </div>
                                </Link>
                                </div>

                                <div className={route.startsWith("/billing")?"item active":"item"}>
                                    <Link href="/billing">
                                        <div>
                                            <h1 className="label">Billing</h1>
                                        </div>     
                                    </Link>                           
                                </div>

                                <div className={route.startsWith("/report")?"item active":"item"}>
                                    <Link href="/reports">
                                        <div>
                                            <h1 className="label">Report</h1>
                                        </div>
                                    </Link>
                                    
                                </div>
                                <div className={route.startsWith("/history")?"item active":"item"}>
                                    <Link href="/history">
                                        <div>
                                            <h1 className="label">History</h1>
                                        </div>
                                    </Link>
    
                                    
                                </div>
                                <div className={route.startsWith("/stock")?"item active":"item"}>
                                    <div>
                                        <h1 className="label">Stock</h1>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="main-container">
                                {children}
                            </div>
                        </div>
                        
                    </div>
                    
                    
                </main>
            </div>
            </ApolloHooksProvider>
            </ApolloProvider>
            </LoadingOverlay>
            

        )
    }    
}

export default withRouter(Layout);