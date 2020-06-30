

// var token = localStorage.getItem("token")

const loginReducer = (state={'token':null},action) =>{
    switch(action.type){
        case 'GET_TOKEN':
            // console.log(localStorage.getItem("token"))
            return{
                ...state,token:localStorage.getItem("token")
            }
        case 'SET_TOKEN':
            localStorage.setItem("token",action.token)    
            return{
                    ...state,token:action.token
                }
        default:
            return state
    }
}

export default loginReducer;