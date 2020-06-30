import Link from 'next/link'
import {useState} from 'react'
import {useQuery} from '@apollo/react-hooks'
import {currentUserQuery} from '../lib/graphql'
import { useDispatch, useSelector } from 'react-redux'
import  {currentUser} from '../redux_function/actions'


  const Navbar =()=>{
    // const {loading,data,error} = useQuery(currentUserQuery)
    const data = true;
    if(data)
    {
      // const dispatch = useDispatch()
      // dispatch(currentUser(data))
      // const store = useSelector(state => state.user)
      // console.log(store)
      

      // cons



      // console.log(data.currentUser.username)
      return(
        <div style={{minHeight:'3.25rem'}}>            
        <div className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div className="navbar-brand" style={{width:'10%'}}>
            <Link href="/">
            <a className="navbar-item" style={{visibility:'hidden'}} >
                <h1 className="is-4 custom-brand">Bacardi</h1>
                {/* <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28"/> */}
            </a>
            </Link>

          <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div> 

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
           <Link href="/create">
            <a className="navbar-item">
                Add New
                </a>
            </Link>
            {/* <a className="navbar-item">
              Home
            </a>
      
            <a className="navbar-item">
              Documentation
            </a> */}
      

            {/* <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                More
              </a>
      
              <div className="navbar-dropdown">
                <a className="navbar-item">
                  About
                </a>
                <a className="navbar-item">
                  Jobs
                </a>
                <a className="navbar-item">
                  Contact
                </a>
                <hr className="navbar-divider"/>
                <a className="navbar-item">
                  Report an issue
                </a>
              </div>
            </div> */}
          </div>
      
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <a className="">
                  {/* <strong>{data.currentUser.username}</strong> */}
                </a>
                {/* <a className="button is-light">
                  Log in
                </a> */}
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
    )
    }
    if(loading){
      return <h1></h1>
    }
}

export default Navbar;