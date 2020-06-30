import Layout from '../components/layout'
import {useForm} from 'react-hook-form'
import {PostLogin} from '../lib/authentication'

const Login =() =>{
    // console.log(localStorage.getItem("token"))
    const { register, handleSubmit, watch, errors } = useForm();
    const Submit=(data)=>{
        console.log(data)
        PostLogin(data)



    }


    return(
        <Layout sidebar={false} navbar={false} title="Login to BACARDI">
            <div style={{marginTop:'50px'}}>
                <div style={{maxWidth:'400px',margin:'auto',padding:'30px', border:'1px solid rgba(0,0,0,.2)',borderRadius:'5px'}}>
                   <div style={{marginTop:'0'}}>
                   
                    <div style={{textAlign:"center"}}>
                        <div className="subtitle" style={{fontWeight:'300',fontSize:'25px'}}>Welcome to BACARDI</div>
                    </div>
                    {/* <div className="subtitle">Login</div> */}
                    <form onSubmit={handleSubmit(Submit)}>
                    <div style={{marginTop:"50px"}}>
                        <div className="columns">
                            <div className="column">
                                <label className="label">Username</label>
                                <input type="text" className="input is-small" name="username" ref={register} placeholder="Username"/>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <label className="label">Password</label>
                                <input type="password" className="input is-small" name="password" ref={register} placeholder="Password" />
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <input type="submit" className="button is-primary is-small"  value="Login"/>
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
            </div>
        
        </Layout>
    )
}

export default Login;