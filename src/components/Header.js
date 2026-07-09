import React, {useState} from 'react'
import {FaCartShopping} from "react-icons/fa6";
import Order from './Order';

const showOrders = (props) => {
    let suma = 0
    props.orders.forEach(el => suma += Number.parseFloat(el.price))
    return (<div>
        {props.orders.map(el => (
            <Order onDelete={props.onDelete} key={el.id} item={el}/>
            ))}
            <p className='suma'>Сума: {new Intl.NumberFormat().format(suma)} грн.</p>
        </div>)
}

const showNothing = () => {
    return(<div className='empty'>
        <h2>Товарів немає</h2>
    </div>)
}


export default function Header(props) {
    let [cartOpen, setCartOpen] = useState(false)
    return (
        <header>
            <div>
                <span className="logo">House staff</span>
                <ul className="nav">
                    <li>О нас</li>
                    <li>Контакти</li>
                    <li>Доставка</li>
                </ul>
                <FaCartShopping
                    onClick={() => setCartOpen(prev => !prev)}
                    className={`shop-cart-button ${cartOpen ? 'active' : ''}`} />{cartOpen && (
                <div className='shop-cart'>
                    {props.orders.length > 0 ?
                        showOrders(props) : showNothing()}
                </div>
            )}
            </div>
            <div className="presentation"></div>
        </header>
    )
}