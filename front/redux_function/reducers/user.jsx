const userReducer = (state={"user":{}},action)=>{
    switch(action.type){
        case 'GET_CURRENT_USER' :
            return {...state,user:action.data}
        default:
        return state
    
    }
}

export default userReducer; 