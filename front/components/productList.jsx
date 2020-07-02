import Link from 'next/link'
import Head from 'next/head'
import { withApollo } from "next-apollo";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks'
import {getAllProductQuery} from '../lib/graphql'
import { useStore,useDispatch, useSelector } from 'react-redux'
import { useEffect,useState } from 'react';
import {addProduct} from '../redux_function/actions'
import { connect } from "react-redux";

const GET_PRODUCT = gql`
query x{
  allProducts{
    edges{
      node{
        id
        name
        listPrice
        mrp
      }
    }
  }
}
`;


const TableView=({products})=>{
  // {products.loading}
  // console.log(products.items)
  if(products.loading)
  return <div>Loading....</div>
  if(products.items.length==0)
  return (<div style={{marginTop:"200px",textAlign:"center",fontSize:"20px",fontWeight:"bold"}}>
          <div>No Product Avaiable please add </div>
        </div>)
    return (
      <div style={{maxWidth:"800px", margin:"auto"}}>
     <table className="table is-fullwidth is-hoverable ">
       <thead>
       <tr>
         <th>Name</th>
         <th>Qty</th>
         <th>Price</th>
         <th>Purchase from</th>
         </tr>
       </thead>
        <tbody>
          {products.items.map((prd)=>{
            return (
            // <tr>
            //   <td>{prd.node.name}</td>
            //   <td>{prd.node.name}</td>
            //   <td>{prd.node.name}</td>
              
              
            //   </tr>
          // <Link href="/detail/[product]" as={`/detail/${prd.node.id}`} key={prd.node.id}> 


            <tr key={prd.node.id} className="data-item" style={{cursor:'pointer'}}>
                  <td>
                    <div className="_heading">
                      {prd.node.name}
                    </div>
                    
                  </td>
                  <td>
                    {prd.node.qty}
                  </td>
                  <td>
                    {prd.node.price}
                  </td>
                  <td>
                    {prd.node.purchaseFrom}
                  </td>
                  {/* <p className="title is-4">{e.node.name}</p>
                  <p className="subtitle is-4">{e.node.id}</p> */}
                
                {/* </Link>   */}
            </tr>
            // </Link>
            )
          })}
          </tbody>
        </table>
        
      </div>
      )
}

function GetProduct(){
  const [allProducts, setAllProducts] = useState(null);
  const product = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(addProduct("X"))
  },[])
  
  const action=()=>{
    dispatch(addProduct("X"))
    
  }
  return (
    <div>
    <TableView products={product.products} />
    </div>)  
  ;

}


export default GetProduct;