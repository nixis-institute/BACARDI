import Head from 'next/head'
import Link from 'next/link'
import {ApolloProvider} from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import client from '../lib/apolloClient';
// import Nav from './navbar';
import { withRouter } from 'next/router'
import Navbar from './navbar';
import LoadingOverlay from 'react-loading-overlay'
import  {FontAwesomeIcon,}  from '@fortawesome/react-fontawesome'
import { faTrashAlt,faEdit, faHospital, faBuilding } from '@fortawesome/free-regular-svg-icons'
import {faHome, faList, faReceipt, faHistory, faUser} from '@fortawesome/free-solid-svg-icons'
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
        const { children,active,loading,loadingText,title = "BACARDI",sidebar=true,navbar=true } = this.props;
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

                
                <main className="main">
                    <div style={{display:'flex'}}>
                        <div className="sidebar" style={{display:sidebar===true?'block':'none'}}>
                            <div className="_side">
                                {/* {route} */}
                                <div className="navbar-brand">
                                    <Link href="/">
                                        <a className="navbar-item">
                                            <h1 className="is-4 custom-brand">BACARDI</h1>
                                        </a>
                                    </Link>

                                </div>
                                <div className={route=="/" ||route.startsWith("/detail/")  ?"item active":"item"} >
                                <Link href="/" >
                                    <div>
                                            <div className="inner_block">
                                                <div className="icn-block">
                                                    <FontAwesomeIcon icon={faHome} className="icon_" />
                                                </div>
                                                <h1 className="label">Product</h1>
                                            </div>
                                    </div>
                                </Link>
                                </div>

                                <div className={route.startsWith("/billing")?"item active":"item"}>
                                    <Link href="/billing">
                                        <div className="inner_block">
                                            <div className="icn-block">
                                                <FontAwesomeIcon icon={faList} className="icon_"/>
                                            </div>
                                            <h1 className="label">Billing</h1>
                                        </div>     
                                    </Link>                           
                                </div>

                                <div className={route.startsWith("/report")?"item active":"item"}>
                                    <Link href="/reports">
                                        <div className="inner_block">
                                            <div className="icn-block">
                                                <FontAwesomeIcon icon={faReceipt} className="icon_"/>
                                            </div>
                                            <h1 className="label">Report</h1>
                                        </div>
                                    </Link>
                                    
                                </div>
                                <div className={route.startsWith("/history")?"item active":"item"}>
                                    <Link href="/history">
                                        <div className="inner_block">
                                            <div>
                                                <FontAwesomeIcon icon={faHistory} className="icon_"/>
                                            </div>
                                            
                                            <h1 className="label">History</h1>
                                        </div>
                                    </Link>
    
                                    
                                </div>
                                <div className={route.startsWith("/profile")?"item active":"item"}>
                                    <Link href="/profile">
                                        <div className="inner_block">
                                            <FontAwesomeIcon icon={faUser} className="icon_"/>
                                            <h1 className="label">Profile</h1>
                                        </div>
                                    </Link>
                                    
                                </div>
                                <div style={{position:'fixed',bottom:10}}>
                                    <div>
                                        admin

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container" style={{padding:'0'}}>
                            <header>
                                {navbar===true?
                                <Navbar/>
                                :""    
                                }
                                
                            </header>
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