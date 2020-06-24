import client from '../../lib/apolloClient';
import { gql } from 'apollo-boost';
import {getAllProductQuery,createProductQuery,generateBillQuery} from '../../lib/graphql'



export const generateBill=(id,date,gst,paymentMode,mlist)=>{
    return dispatch=>{
        dispatch(billGenerateLoading());
        return client.mutate({
            mutation:generateBillQuery,
            variables:{
                "medicines": mlist,
                "userId": id,
                "date": date,
                "gst": gst,
                "payment": paymentMode
            }
        }).then((e)=>{
            dispatch(billGenerated(e.data.generateBill.bill.invoiceNumber,e.data.generateBill.bill.invoice))

        }).catch((error)=>{
            dispatch(billFailure(error))
        })
    }
}

export const createProduct =(data) =>{
    return dispatch=>{
        dispatch(createProductsBegin());
        return client.mutate({
            mutation:createProductQuery,
            variables:{
                "medicine": data.medicine,
                "qty": data.qty,
                "mrp": data.mrp,
                "purchase": data.purchase,
                "typeofpack": data.typeofpack,
                "gst": data.gst,
                "exp":data.exp_date,
                "discount":data.discount,
                "hsn":data.hsn,
                "batch":data.batch,
                "mfg":data.mfg
            }
        }).then(res=>{
            dispatch(createProductSucess(res.data))
            return res.data
        }).catch(err=>{
            dispatch(createProductsFailure(err))
        })
    }
}


export const addProduct = (product) =>{
    return dispatch =>{
        dispatch(fetchProductsBegin());
        return client.query({query:getAllProductQuery})
        .then(res=>{
            if(!res.loading){
                dispatch(fetchProductsSuccess(res.data))
                return res.data
            }
        })
        .catch(err=>dispatch(fetchProductFail(error)))
    }
}


export const CREATE_PRODUCTS_SUCCESS = 'CREATE_PRODUCTS_SUCCESS';
export const CREATE_PRODUCTS_BEGIN = 'CREATE_PRODUCTS_BEGIN';
export const CREATE_PRODUCTS_FAILURE = 'CREATE_PRODUCTS_FAILURE';


export const FETCH_PRODUCTS_BEGIN   = 'FETCH_PRODUCTS_BEGIN';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';


export const createProductSucess = (product) =>({
    type:CREATE_PRODUCTS_SUCCESS,
    payload:product
})


export const billGenerateLoading = () => ({
    type : 'BILL_LOADING'
})
export const billGenerated = (invoiceNumber,invoice) => ({
    type:'BILL_GENERATED',
    invoice:invoiceNumber,
    link:invoice
})

export const billFailure = (error) =>({
    type:'BILL_FAILURE',
    error :error
})

export const createProductsBegin = () => ({
    type: CREATE_PRODUCTS_BEGIN
});

export const createProductsFailure = products => ({
    type: CREATE_PRODUCTS_FAILURE,
    payload: { error }
  });


  
export const fetchProductsBegin = () => ({
  type: FETCH_PRODUCTS_BEGIN
});

export const fetchProductsSuccess = products => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: { products }
});

export const fetchProductsFailure = error => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: { error }
});