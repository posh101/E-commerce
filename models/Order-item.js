const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
   quantity: {
    type: Number,
    required: true
   },
   product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
   }
})

const OrderItem = mongoose.model('OrderItem', orderItemSchema)
module.exports = OrderItem;


//{
   // "orderItems": [
   // {
    //"quantity": 3,
    //"product": "6484257389a11fee42e9b8cb"
    //},
    //{
    //"quantity": 2,
    //"product": "64842645937ed0e75fad0fab"
    //}
    
    //],
    //"shippingAddress1": "Flowers street, 45",
    //"shippingAddress2": "1-8",
    //"city": "Prague",
    //"zip": "00000",
    //"country": "Czech Republic",
    //"phone": "12647723",
    //"user": "648c8af4612bcd8b99f951fe"
    //}