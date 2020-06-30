import client from '../../lib/apolloClient';
import { gql } from 'apollo-boost';
import {getAllProductQuery,createProductQuery,generateBillQuery, currentUserQuery, updateCurrentUserQuery} from '../../lib/graphql'



export const getCurrentUser=()=>{
    return dispatch=>{
        dispatch(userLoading)
        return client.query({
            query:currentUserQuery
        }).then((e)=>{
            dispatch(currentUser(e.data.user))
        }).catch((e)=>{
            dispatch(userError(e))
        })
    }
}

export const updateUser = (data) =>{
    return dispatch=>{
        dispatch(userUpdateLoading());
        return client.mutate({
            mutation:updateCurrentUserQuery,
            variables:{
                "gst": data.gst,
                "tin": data.tin,
                "firstName": data.firstName,
                "lastName": data.lastName,
                "phone": data.phone,
                "email": data.email,
                "firm": data.firm,
                "address": data.address                
            }
        }).then((e)=>{
            dispatch(updatedUser(e.data.updateUser.user))
        }).then((e)=>{
            dispatch(userError(e))
        })
    }
}



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


export const userLoading = () =>({
    type:'USER_LOADING',
})
export const userError = (error) =>({
    type:'USER_ERROR',
    error:error
})
export const currentUser = (user) => ({
    type:'GET_CURRENT_USER',
    data:user
})

export const userUpdateLoading = () =>({
    type:'USER_UPDATE_LOADING'
})

export const updatedUser = (user) =>({
    type:'UPDATED_USER',
    data:user

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

export const setToken = () =>({
    type:'SET_TOKEN',
    token:localStorage.getItem("token")
})

export const getToken = () =>({
    type :'GET_TOKEN'
})