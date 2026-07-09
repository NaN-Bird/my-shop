import React from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Items from "./components/Items"
import Categories from "./components/Categories";
import ShowFullItem from "./components/ShowFullItem";


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orders: [],
            currentItems:[],
            items: [
                {
                    id: 1,
                    title: "Стул сірий",
                    img: "chair.jpg",
                    desc: "lorem5 sdgfwfdgwdfgwd rwertwe,rgfwergew ",
                    category: "chair",
                    price: "525"
                },
                {
                    id: 2,
                    title: "Стол",
                    img: "table.jpg",
                    desc: "lorem5 sdgfwfdgwdfgwd rwertwe,rgfwergew ",
                    category: "table",
                    price: "1125"
                },
                {
                    id: 3,
                    title: "Діван",
                    img: "sofa.jpg",
                    desc: "lorem5 sdgfwfdgwdfgwd rwertwe,rgfwergew ",
                    category: "sofa",
                    price: "23450"
                },
                {
                    id: 4,
                    title: "Кровать",
                    img: "bed.jpg",
                    desc: "lorem5 sdgfwfdgwdfgwd rwertwe,rgfwergew ",
                    category: "bed",
                    price: "6730"
                },
                {
                    id: 5,
                    title: "Шафа",
                    img: "wardrobe.jpg",
                    desc: "lorem5 sdgfwfdgwdfgwd rwertwe,rgfwergew ",
                    category: "wardrobe",
                    price: "15700"
                }

            ],
            showFullItem: false,
            fillItem:{}
        }
        this.state.currentItems = this.state.items
        this.addToOrder = this.addToOrder.bind(this)
        this.deleteOrder = this.deleteOrder.bind(this)
        this.chooseCategory = this.chooseCategory.bind(this)
        this.onShowItem = this.onShowItem.bind(this)
    }

    render() {
        return (
            <div className='wrapper'>
                <Header orders={this.state.orders} onDelete={this.deleteOrder}/>
                <Categories chooseCategory = {this.chooseCategory} />
                <Items onShowItem={this.onShowItem} items={this.state.currentItems} onAdd={this.addToOrder}/>
                {this.state.showFullItem && <ShowFullItem onAdd={this.addToOrder} onShowItem={this.onShowItem} item={this.state.fullItem}/>}
                <Footer/>
            </div>
        )
    }

    onShowItem(item) {
        this.setState({
            fullItem: item,
            showFullItem: !this.state.showFullItem
        });
    }

    chooseCategory(category){

        if(category === 'all'){
            this.setState({currentItems:this.state.items})
            return
        }

        this.setState({
            currentItems: this.state.items.filter(el => el.category === category)
        })
    }

    deleteOrder(id) {
       this.setState({orders: this.state.orders.filter(el => el.id !== id) })
    }

    addToOrder(item) {
        let isItArray = false
        this.state.orders.forEach(el => {
            if (el.id === item.id)
                isItArray = true
        })
        if (!isItArray)
            this.setState({orders: [...this.state.orders, item]})
    }
}

export default App;
