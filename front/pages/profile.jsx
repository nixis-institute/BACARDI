import Layout from "../components/layout"
// import {} from 'react'
import {currentUserQuery} from '../lib/graphql'
import {useQuery} from '@apollo/react-hooks'
import {AuthProps,privateRoute} from '../lib/private_route'


const Profile =(props) =>{

    const {loading,data,error}  = useQuery(currentUserQuery)
    if(loading)
    {
        return <div>Loading...</div>
    }

    var user = data.user

    console.log(data.user)
    return (
    <Layout title="Profile">
        <div>
            <div>
                <h1 className="title">Welcome {user.firstName} {user.lastName}</h1>
            </div>
            <div>
                <div className="columns">
                    <div className="column">

                    </div>
                </div>

            </div>
        </div>
    </Layout>
    )
}

export default privateRoute(Profile);