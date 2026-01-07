import React from 'react'
import { useCartStore } from '../store/cart'
import MyCart from "../components/MyCart"


const MyCartPage = () => {

    const {cart} = useCartStore();
    return (
        <div>
            <h1>My Cart Page!</h1>
            <MyCart cart ={cart}/>
        </div>
        
    )
}

export default MyCartPage