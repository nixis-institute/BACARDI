import Layout from "../components/layout"
import {useForm} from 'react-hook-form'
import { useQuery,useMutation } from '@apollo/react-hooks'
import { getAllPatient,productSuggetionQuery, generateBillQuery } from "../lib/graphql";
import { useStore,useDispatch, useSelector } from 'react-redux'
import {useState, useEffect,Fragment} from 'react'
import React from 'react'
import client from "../lib/apolloClient";
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import { faTrashAlt,faEdit } from '@fortawesome/free-regular-svg-icons'
import {PDFViewer,PDFDownloadLink} from '@react-pdf/renderer'
// import Invoice from "./invoice";
import dateFormat from 'dateformat'
import { generateBill } from "../redux_function/actions";
// import Pdf from "react-to-pdf";

const ref = React.createRef();


function useGenerateBill(patientId,date,gst,paymentMode,medicies){
    const [loading,setLoading] = React.useState(true)
    const [error,setError] = React.useState(false)
    const [invoiceNumber,setInvoiceNumber] = React.useState()
    
    useEffect(()=>{
        setLoading(true)
        client.mutate({
            mutation:generateBillQuery,
            variables:{
                "medicines": medicies,
                    "userId": patientId,
                  "date": date,
                  "gst": gst,
                  "payment": paymentMode
              
            }
        }).then((d)=>{
            setInvoiceNumber(d.data.generateBill.invoiceNumber)
            setLoading(false)
            setError(true)
        }).catch((e)=>{
            setLoading(false)
            setError(true)
        })
    },[])

    return {loading,invoiceNumber,error}
    
}



// import  {} from '@fortawesome/fontawesome-svg-core'


// const Suggestion=({text})=>{
//     const {loading,data} = useQuery(productSuggetionQuery,{variables:{"suggestion":text}})
    
    
//     if(loading)
//         return(
//             <div>
//                 loading..
//             </div>
//         )
//     let list = data.productSuggestion
//     if(text.length ==0)
//         list =[]
//     return (
    
    
//     <div style={{position:'absolute',zIndex:'1',background:'white'}} className="_list">
//         {list.map((e)=>{
//            return <div className="_list-item" key={e.id} onClick={}>
//                <div>
//                     <span className="left">{e.name}</span>
//                     <span className="right">&#x20b9; {e.price}</span>
//                </div>
//            </div>
//         })}   
//     </div> 
    
//     )
//     // console.log(data.productSuggestion)
//     // return <div>a</div>
// }


// const Modal =({active})=>{
//     // console.log("sdf")
//     const [ac,setAc] = useState(active)
//     console.log(ac)
//     return(
//         <div className={ac} id="bill" >
//             <div className="modal-background"></div>
//             <div className="modal-card">
//                 <header className="modal-card-head">
//                 <p className="modal-card-title">Modal title</p>
//                 <button className="delete" onClick={()=>setAc("modal")} aria-label="close"></button>
//                 </header>
//                 <section className="modal-card-body">
//                 </section>
//                 <footer className="modal-card-foot">
//                 <button className="button is-success">Save changes</button>
//                 <button className="button">Cancel</button>
//                 </footer>
//             </div>
//         </div>
//     )
// }


const Billingform =() =>{
    const [qlabel,setQlabel] = useState("")
    const [mlist,setMlist] = useState([])
    const [list,setList] = useState([])
    const [active,setActive] = useState("modal")
    const [text,setText] = useState("")
    const { register, handleSubmit,setValue,getValues } = useForm();
    const {loading,error,data} = useQuery(getAllPatient)
    const product = useSelector(state => state.products);
    const billstore = useSelector(state => state.bills);
    const dispatch = useDispatch()
    if(loading)
        return <div>Loading..</div>
    // console.log(data.allPatient)

    const selectOption=(d)=>{
        // console.log(d.target.value)
        data.allPatient.map((e)=>{
            if(e.name+" ("+e.age+")" === d.target.value)
                setValue([{"age":e.age},{"gender":e.sex},{"patientId":e.id}])
        })
    }

    const BillToServer=(id,date,gst,payment,mlist)=>{
        // const {loading,error,invoiceNumber} = useGenerateBill(id,date,gst,payment,mlist)
        console.log(id)
        dispatch(generateBill(id,date,gst,payment,mlist))

        // console.log(loading)
        // console.log(error)
        // console.log(invoiceNumber)
    }

    const fillMedicineInfo = (id,medicine,qty,price,expiry,discount)=>{
        // console.log("tap")
        setQlabel(` (${qty})`)
        setValue([
            {"id":id},
            {"medicine":medicine},
            // {"qty":qty},
            {"price":price},
            {"expiry":expiry},
            {"discount":discount}
        ])
        setList([])
    }

    const AddRows=()=>{
        setMlist(mlist.concat(
            [{
//[{"name": "Anodyine","qty": 2,"medicineId": "UHJvZHVjdE5vZGU6MQ==","price": 2,"discount": 0,"expiry":"15/6/2020" }]

                "medicineId":getValues("id"),
                "name":getValues("medicine"),
                "qty":getValues("qty").length? getValues("qty"):1,
                "price":getValues("price"),
                "expiry":getValues("expiry"),
                "discount":getValues("discount").length?getValues("discount"):0
            }]
        ))
        setValue([
            {"medicine":""},
            {"qty":""},
            {"price":""},
            {"expiry":""},
            {"discount":""},
        ])

        // console.log(mlist)
    }



    const selectMedicineOption = async (d)=>{
        // const {loading,data} = useQuery(productSuggetionQuery,{variables:{"suggestion":d.target.value}})
        var vl = d.target.value
        var result = await client.query({
            query:productSuggetionQuery,
            variables:{
                "suggestion":d.target.value
            }
        })
        if(result.loading == false)
        // console.log(result.data.productSuggestion)
        // console.log(vl)
        if(vl.length==0)
        {
            // console.log("empty")
            setList([])
        }else{
            setList(result.data.productSuggestion)
        }

    }
    const deletefromtemp=(id)=>{
        console.log(id)

        // console.log(id)
        // mlist.map((e,i)=>{
        //     if(e.id == id){
        //         {
        //             console.log(e.name)
        //             mlist.splice(i,1)
        //         }
                
        //     }
        // })
        // console.log(mlist.length)
        mlist.splice(id,1)
        // console.log(mlist.length)
        // console.log(id.target)
        console.log(mlist)
        // setMlist(mlist)
        setMlist(mlist.concat([]))
        // return true

        // console.log(mlist)
        // ()=>setMlist(mlist.map((d,index)=>index!=i?d:null))
    }
    // console.log(mlist)
    console.log(billstore)

    return (
        <div style={{maxWidth:'800px',margin:'auto'}}>
            <form>
            <div>   
                <h2 className="subtitle" style={{marginTop:"10px",fontWeight:'300'}}>User detail</h2>
            </div>
            
            <div style={{padding:"10px"}}>
                <div className="columns is-mobile" style={{display:'flex'}}>
                    <div className="column">
                        <label className="label">Patient Name</label>
                        

                        <input list="patient_name" className="input is-small" ref={register}
                        //  onChange={()=>setQty(qty)} value={qty} 
                        type="text" name="patient"  placeholder="Patient Name" onChange={selectOption}/>
                        
                        <datalist id="patient_name">
                            {data.allPatient.map((e)=>{
                                return <option key={e.id} value={e.name +" ("+ e.age+")"} onClick={selectOption}/>
                            })}
                        </datalist>

                    </div>
                    <div className="column">
                        <label className="label">Age</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="age" placeholder="Age"/>
                    </div>
                    <input type="hidden" ref={register} name="patientId"/>
                    <div className="column">
                        <label className="label">Gender</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="gender" placeholder="Gender"/>
                    </div>
                </div>
            </div>
            <div>   
                <h2 className="subtitle" style={{marginTop:"10px",fontWeight:'300'}}>Billing detail</h2>
            </div>
            <div style={{padding:"10px"}}>
            
                <div className="columns">
                    <div className="column">
                        <label className="label">Payment Mode</label>
                        <input className="input is-small" ref={register}
                        //  onChange={()=>setQty(qty)} value={qty} 
                        type="text" name="payment"  placeholder="Payment Mode"/>
                    </div>
                    <div className="column">
                        <label className="label">GST</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="gst" placeholder="GST"/>
                    </div>
                    <div className="column">
                        <label className="label">Date</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="date" name="date" placeholder="date"/>
                    </div>
                </div>
            </div>


            <div>   
                <h2 className="subtitle" style={{marginTop:"10px",fontWeight:'300'}}>Add Medicines</h2>
            </div>

            <div style={{padding:"10px"}}>
                <div className="columns">
                    <div className="column">
                        <label className="label">Medicine</label>
                        <input className="input is-small" list="medicine_name" ref={register} autoComplete="off"
                        //  onChange={()=>setQty(qty)} value={qty} 
                        type="text" name="medicine"  placeholder="Medicine" onChange={selectMedicineOption} />
                        

                        <div style={{position:'absolute',zIndex:'1',background:'white',display:list.length?"block":"none"}} className="_list">
                            { list.map((e)=>{
                            return <div className="_list-item" key={e.id} onClick={()=>fillMedicineInfo(e.id,e.name,e.qty,e.price,e.expiryDate,e.discount)}>
                                <div key={e.id} >
                                        <span className="left">{e.name}</span>
                                        <span className="right">&#x20b9; {e.price}</span>
                                </div>
                            </div>
                            })}   
                        </div>

                        {/* <datalist id="medicine_name">
                            {product.items.map((e)=>{
                                return <option key={e.id} value={e.node.name +" ("+ e.node.qty+")"} onClick={selectMedicineOption}/>
                            })}
                        </datalist> */}


                    </div>
                    <div className="column">
                        <label className="label">Quantity<span style={{fontSize:12,fontWeight:'normal'}}>{qlabel}</span></label>
                        <input type="hidden" name="id" ref={register}/>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="qty" placeholder="Quantity"/>
                    </div>
                    <div className="column">
                        <label className="label">Price</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="price" placeholder="Price"/>
                    </div>
                    <div className="column">
                        <label className="label">Expiry Date</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="date" name="expiry" placeholder="Expiry Date"/>
                    </div>
                    <div className="column">
                        <label className="label">Discount</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="discount" placeholder="Discount"/>
                    </div>
                    <div className="column is-1">
                    {/* <label className="label">Add</label> */}
                        <div style={{display:'table',height:'100%',width:'100%',textAlign:'center'}} onClick={AddRows}>
                            <div className="_icon" style={{display:'table-cell',verticalAlign:'bottom'}}>
                            <div style={{fontSize:'25px',fontWeight:'bolder',cursor:'pointer'}}>+</div>
                            </div>
                        </div>

                    </div>
                </div>    
            </div>


              
            </form>

            <div className="datatable" style={{display:mlist.length?'block':'none',marginTop:'70px'}}>
            {/* {console.log(mlist)} */}
                <table className="table is-fullwidth ctable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Discount</th>
                            <th></th>
                            <th></th>
                            {/* <th></th> */}
                        </tr>
                    </thead>
                
                <tbody>
                {mlist.map((e,i)=>{
                    // let date = dateFormat(e.expiry,"dd mmmm yyyy")
                    // console.log(date)
                    // console.log(e.expiry)
                    return(
                        <tr key={e.medicineId} style={{fontSize: "13px",
                            letterSpacing: "1px",
                            marginBottom: "5px",
                            textTransform: "uppercase"
                            }}>
                            <td style={{fontWeight:'bold'}}>{e.name}</td>
                            <td>{e.price}</td>
                            <td>{e.qty??1}</td>
                            <td>{e.discount??1}</td>
                            <td onClick={deletefromtemp.bind(null,i)} style={{cursor:'pointer'}}>
                                <FontAwesomeIcon icon={faTrashAlt} color="red" />
                            </td>
                            <td>
                                <FontAwesomeIcon icon={faEdit} color="green" />
                            </td>
                            {/* <td>{e.}</td> */}
                        </tr>
                    )
                })}
                </tbody>
                </table>

                {/* { billstore.invoice!=null?<PDFDownloadLink document={
                    <Invoice invoiceNumber = {billstore.invoice} table={mlist} name={getValues("patient")} age={getValues("age")} gender={getValues("gender")} GST={getValues("gst")} paymentmode={getValues("payment")} invoiceDate={dateFormat(getValues("date"),"dd mmmm yyyy")}  />}>
                    <button type="button" className="button is-primary is-small" data-target="bill" aria-haspopup="true">
                        Download
                    </button>
                </PDFDownloadLink> :
                    <button type="button" className="button is-primary is-small" data-target="bill" aria-haspopup="true"
                    onClick={()=>
                        BillToServer( getValues("patientId"),getValues("date"),getValues("gst"),getValues("payment"),mlist)}>
                        {billstore.invoice==null?"Generate":"Download bill"}
                    </button>
                } */}

                <a onClick={()=>
                        // billstore.invoice==null?
                        BillToServer( getValues("patientId"),getValues("date"),getValues("gst"),getValues("payment"),mlist)
                        // :location.href=`http://localhost:8000/media/${billstore.link}`
                    }
                target={billstore.invoice==null?'_self':'_blank'}>


                <button type="button" className="button is-primary is-small" data-target="bill" aria-haspopup="true">
                        {billstore.invoice==null?"Generate":"Download bill"}
                </button>
                </a>
                
                    {/* Download */}
                

                {/* <PDFViewer width="100%" height="100%">
                    <Invoice table={mlist}/> 
                </PDFViewer> */}


                
                {/* <Pdf targetRef={ref} filename="code-example.pdf">
                    {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
                </Pdf> */}

                {/* <PDFViewer width="100%" height="100%"> */}
                    {/* <div ref={ref}>
                        <Invoice table={mlist} name={getValues("patient")}/>
                    </div> */}
                    
                {/* </PDFViewer> */}


                {/* <Modal active="modal"/> */}

                <div className={active} id="bill" >
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                        <p className="modal-card-title">Bill</p>
                        <button className="delete" onClick={()=>setActive("modal")} aria-label="close"></button>
                        </header>
                        <section className="modal-card-body">
                        

                        {/* <PDFDownloadLink
                            document={<Invoice table={mlist} name={getValues("patient")} />}
                        >
                            Download
                        </PDFDownloadLink> */}
                             
                            
                        




                        
                        <h2 className="_subtitle" style={{fontSize:'20px',fontWeight:600}}>{getValues("patient")}</h2>
                        {/* <h2>{getValues("age")}</h2> */}
                        <h2>{getValues("gender")}</h2>
                        
                        




                        <table className="table is-fullwidth ctable" style={{marginTop:'20px',marginBottom:'20px'}}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Discount</th>
                                    <th></th>
                                    <th></th>
                                    {/* <th></th> */}
                                </tr>
                            </thead>
                        
                        <tbody>
                        {mlist.map((e,i)=>{
                            return(
                                <tr key={e.medicineId} style={{fontSize: "13px",
                                    letterSpacing: "1px",
                                    marginBottom: "5px",
                                    textTransform: "uppercase"
                                    }}>
                                    <td style={{fontWeight:'bold'}}>{e.name}</td>
                                    <td>{e.price}</td>
                                    <td>{e.qty??1}</td>
                                    <td>{e.discount??1}</td>
                                    <td onClick={deletefromtemp.bind(null,i)} style={{cursor:'pointer'}}>
                                        <FontAwesomeIcon icon={faTrashAlt} color="red" />
                                    </td>
                                    <td>
                                        <FontAwesomeIcon icon={faEdit} color="green" />
                                    </td>
                                    {/* <td>{e.}</td> */}
                                </tr>
                            )
                        })}
                        </tbody>
                        </table>
                        </section>
                        <footer className="modal-card-foot">
                        <button className="button is-primary is-small">Save changes</button>
                        <button className="button is-small" onClick={()=>setActive("modal")}>Cancel</button>
                        </footer>
                    </div>
                </div>
                
            </div>
        </div>
    )

}





const Bill = () =>{
    
    
    const billstore = useSelector(state => state.bills);
    // console.log(billstore)
    return(
        <Layout loading={billstore.loading} title="Generate Bill" >
            <div>
                <Billingform/>
            </div>
        </Layout>
    )
}

export default Bill