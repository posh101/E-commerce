const express = require('express')
const Order = require('../models/orders.model')
const OrderItem = require('../models/Order-item')

const orderRouter = express.Router()

orderRouter.get('/', async (req, res) => {
const orderList = await Order.find()
.populate('user', 'name')
.populate({path:'orderItems', 
populate:{path: 'product', 
populate: 'category'}})
.sort({'dateOrdered': -1})
if(!orderList) {
    res.status(500).json({success: false})
}
else {
    res.send(orderList)
}
})

orderRouter.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({path:'orderItems', 
     populate:{path: 'product', 
     populate: 'category'}})
    .sort({'dateOrdered': -1})
    if(!order) {
        res.status(500).json({success: false})
    }
    else {
        res.send(order)
    }
    })

orderRouter.post('/', async (req, res) => {
const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
    let newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product,
    })

    await newOrderItem.save();

    return newOrderItem._id
}))

const orderItemIdResolved = await orderItemsIds

const totalPrices = await Promise.all(orderItemIdResolved.map(async (orderItemId) => {
 const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
 const totalPrice = orderItem.product.price * orderItem.quantity;

 return totalPrice;
}))

const totalPrice = totalPrices.reduce((a, b) => a+b, 0)
console.log(totalPrice)

    const orderList = new Order({
        orderItems: orderItemIdResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
        dateOrdered: req.body.dateOrdered
    })

   await orderList.save()

    if(!orderList) {
        res.status(400).json({success: false, message: 'Invalid order'})
    }
    res.status(200).send(orderList)
})

orderRouter.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id,
    {
        status: req.body.status
    },
    {new: true}
    )
    if(!order) {
        return res.status(400).send('User cannot be created')
    }
     res.send(order)
})

orderRouter.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id)
    .then(async order => {
       if(order) {
         await order.orderItems.map(async orderItem => {
          await OrderItem.findByIdAndRemove(orderItem)
         })
          res.status(200).json({success: true, message: "Successfully deleted an order"})
       }
       else {
          res.status(404).json({success: false, message: "Error deleting order"})
       }
    })
    .catch((err) => { 
     return res.status(400).json({success: false, error: err})
 })
 })
  
    orderRouter.get('/get/sales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: {_id: null, sales:{ $sum :'$totalPrice'}}}
    ])

    if (!totalSales){
        return res.status(400).send('the order sales cannot be generated')
    }
    res.send({totalsales: totalSales.pop().sales})
})

    orderRouter.get('/get/count', async (req, res) => {
    const orderCount = await Order.countDocuments('count')
    if(!orderCount) {
        res.status(500).json({
            success: false
        })
    } else { 
        res.send({
            orderCount: orderCount 
        })
    }      
})

orderRouter.get('/get/userOrders/:userId', async (req, res) => {
    const userOrderList = await Order.findById(req.params.userId)
    .populate({path:'orderItems', 
     populate:{path: 'product', 
     populate: 'category'}})
    .sort({'dateOrdered': -1 })
    if(!userOrderList) {
        res.status(500).json({success: false})
    }
    else {
        res.send(userOrderList)
    }
})

    

module.exports = orderRouter;