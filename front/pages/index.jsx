// import { } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Layout from '../components/layout'
import { withApollo } from "next-apollo";
// import { gql } from 'apollo-boost'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks'
import {getAllProductQuery} from '../lib/graphql'
import { useStore,useDispatch, useSelector } from 'react-redux'
import { useEffect,useState } from 'react';
import {addProduct} from '../redux_function/actions'
// import withRedux from 'next-redux-wrapper'
import { connect } from "react-redux";
// import {React} from 'react'
// import { ApolloProvider } from '@apollo/react-hooks';



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
  
    return (
      <div style={{maxWidth:"800px", margin:"auto"}}>
     <table className="table is-fullwidth is-hoverable is-striped">
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
                    <div className="heading">
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
    // if(product.products.items.length==0)
    dispatch(addProduct("X"))
    // console.log(product.products)
    // console.log("effect")
  },[])
  
  const action=()=>{
    dispatch(addProduct("X"))
    //  console.log("clicked")
    
  }
  // console.log(product.products)
  // useEffect(()=>{
  //   // dispatch(addProduct("X"))
  //   console.log("s")
  // },[])

  // useEffect(()=>{
  //   // dispatch({type:"ADD_PRODUCT",value:[{"name":"ajay","age":13},{"name":"amit","age":23}]})
  //   console.log("XXX");
  //   // console.log(products)
  //   // dispatch({type:"ADD_PRODUCT",value:data.allProducts.edges})
  // },[])

  // console.log(products)
  // let products =[]

  return (
    <div>
      {/* {product.products.products.name} */}
    {/* {
      product.products.items.map((e)=>
        <h2 key={e.node.id}>{e.node.name}</h2>
      )
    } */}
    <TableView products={product.products} />
    
      <button className="btn btn-primary" onClick={action}>
        Submit action
      </button>
    </div>)
  // return <div>{products.map((e)=>{

  // <p>{e.name}</p>
  // })}</div>
  
  // (
  // <div>
  //   <table className="table is-fullwidth is-hoverable is-striped">
  //     <thead>
  //     <tr>
  //       <th>Name</th>
  //       <th>Qty</th>
  //       <th>Price</th>
  //       <th>Purchase from</th>
  //       </tr>
  //     </thead>
  //   <tbody>


  //   {/* {products.products.map} */}
  //   {/* <p>{products}</p> */}
  //   {/* {products.map((e)=>{
  //     <tr>
  //       <td>
  //         {e.id}
  //       </td>
  //       <td>
  //         {e.qty}
  //       </td>
  //       <td>
  //         {e.price}
  //       </td>
  //       <td>
  //         {e.purchaseFrom}
  //       </td>
  //     </tr>
  //   })} */}
  //   {data.allProducts.edges.map((e)=>
  //   <Link href="/detail/[product]" as={`/detail/${e.node.id}`} >
  //   <tr key={e.node.id} className="data-item" style={{cursor:'pointer'}}>
  //         <td>
  //           <div className="heading">
  //             {e.node.name}
  //           </div>
            
  //         </td>
  //         <td>
  //           {e.node.qty}
  //         </td>
  //         <td>
  //           {e.node.price}
  //         </td>
  //         <td>
  //           {e.node.purchaseFrom}
  //         </td>
  //         {/* <p className="title is-4">{e.node.name}</p>
  //         <p className="subtitle is-4">{e.node.id}</p> */}
        
  //       {/* </Link>   */}
  //   </tr>
    
  //   </Link>
      
  //     )}</tbody>
  // </table>
  // </div>)
  
  ;
  // print(data)

}

class Index extends React.Component{
  render(){
    // const {loading,error,data} = useQuery(get_product)
    // if(loading){
    //   return <h1>Loading...</h1>
    // }
    // if(error){
    //   return <h1>Error...</h1>
    // }
    // print(data);
    return (
      <Layout>
        <GetProduct></GetProduct>
        {/* <div>
          Index
            <Link href="/about">About</Link>
        
        </div> */}
      </Layout>
      
        // <div>
        // <Head>
        //   <title>Home Page</title>
        // </Head>
        // <body className="layout">
        //     <main className="bd-main">
        //       <header className="bd-header">
        //         <div className="bd-header-titles">
        //           <h1 className="title">Documentation</h1>
        //           <p className="subtitle is-4">
        //           Everything you need to create a website with Bulma 
        //           </p>
        //         </div>
        //       </header>

        //     </main>
        // </body>
        // </div>
      
    )
  }
}

export default Index;
// export default withApollo(Index);