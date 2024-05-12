import {
    redirect,
    Navigate
  } from "react-router-dom";
const GuestRequire = ({children})=>{
    const user = localStorage.getItem('user')
    if(user){
        return <Navigate to={'/chat'} />
    }else{
        return children
    }
}

export default GuestRequire