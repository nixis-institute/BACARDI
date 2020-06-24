
const billReducer=(state={'loading':false,'error':null,'invoice':null,'link':null},action)=>{
    switch(action.type){
        case 'BILL_LOADING':
            return {...state,loading:true,error:null}
        case 'BILL_GENERATED':
            return {
                ...state,loading:false,error:null,invoice:action.invoice,link:action.link
            }
        case 'BILL_FAILURE':
            return {
                ...state,loading:false,error:action.error
            }
        default:
        return  state
    }
    
}

export default billReducer;