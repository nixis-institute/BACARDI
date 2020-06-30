import Layout from '../components/layout'
import {useState} from 'react'
import { useQuery,useLazyQuery } from '@apollo/react-hooks'
import {historyBySlugQuery} from '../lib/graphql'

const Result = ({loading,data})=>{
    return(
        <div className="data">
            <style jsx>{`
             td,th{
                 font-size:13px;
             }
             .data{
                 margin-top:50px;
             }
            `} </style>
            {loading===true
            ?(<div style={{textAlign:'center',fontWeight:'bold',fontSize:'20px'}}>Loading...</div>):
            data!=undefined?
            data.history.edges.length?
            <table className="table is-fullwidth">
                <thead>
                    <tr>
                        <th>SN.</th>
                        <th>Invoice Number</th>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Gross</th>
                        <th>Discount</th>
                        <th>CGST</th>
                        <th>SGST</th>
                        <th>Net Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.history.edges.map((item,i)=>{
                        return (<tr key={item.id}>
                            <td>{i+1}</td>
                            <td>
                                <a href={`http://localhost:8000/media/${item.node.invoice}`} target="_blank">
                                    {item.node.invoiceNumber}
                                </a>
                                </td>
                            <td>{item.node.billingDate}</td>
                            <td>{item.node.patient.name}</td>
                            <td>{item.node.grossAmount}</td>
                            <td>{item.node.discount}</td>
                            <td>{item.node.cgst}</td>
                            <td>{item.node.sgst}</td>
                            <td>{item.node.netAmount}</td>
                        </tr>)
                    })}
                </tbody>
            </table>:
            <div style={{textAlign:'center',fontWeight:'bold',fontSize:'20px'}}>No Data Found</div>           
            :<div></div>
            }

            </div>
    )
}



const History =() =>{
    const [slug,setSlug] = useState("")
    const [getHistory, {loading,error,data}] = useLazyQuery(historyBySlugQuery)    
    return (
        <Layout title="History">
            <div style={{'marginTop':'20px'}}>
                <div style={{maxWidth:'800px',margin:'auto',}}>
                    <div>
                    <div className="columns">
                        <div className="column">
                            <label className="label">Invoice/Name</label>
                            <input type="text" className="input is-small" placeholder="Search Invoice,name"
                            onChange={e=>setSlug(e.target.value)}
                            />
                        </div>
                        <div className="column is-3">
                            <label className="label" style={{visibility:'hidden'}}>Invoice/Name</label>
                            <input type="button" className="is-small button is-primary" value="Search"
                            onClick={()=>getHistory({variables:{"slug":slug}})}
                            />
                        </div>
                        </div>
                    </div>    
                    <Result loading={loading} data={data}/>
                </div>

            </div>
        </Layout>
    )
}

export default History;