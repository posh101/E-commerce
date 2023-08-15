const mongoose = require('mongoose')
const Product = require('../models/product.model')
const Category = require('../models/category.model')
const express = require('express')
const multer = require('multer')

// Initializing express
const productRouter = express.Router()

// Storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/uploads')
    },

    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
   //Init storage
  const uploadOptions = multer({ storage: storage })

// Getting the list of product with the categories
productRouter.get('/', async (req, res) => {
    let filter = {}
    if(req.query.categories) {
        const filter = {category: req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category')
    if(!productList) {
        res.status(500).json({
            success: false
        })
    } else { 
        res.send(productList)
    }      
})
 
// Getting the number of product 
productRouter.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments((count) => count)
    if(!productCount) {
        res.status(500).json({
            success: false
        })
    } else { 
        res.send({
            productCount: productCount 
        })
    }      
})

// Getting the number of featured product
productRouter.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured: true}).limit(count)
    if(!products) {
        res.status(500).json({
            success: false
        })
    } else { 
        res.send(products)
    }      
})

// Implementing Admin section(posting of product with category with single product image upload)
 productRouter.post('/',uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if(!category) {
       return res.status(400).send('Invalid category')
    } 
    const file = req.file;
    if(!file){
        return res.status(400).send('No image found')
    }
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    console.log(req.file)

     const product = new Product({
         name: req.body.name,
         description: req.body.description,
         richDescription: req.body.richDescription,
         image: `${basePath} ${fileName}`, //"http://localhose:8000/public/uploads/image-2323232"
         images: req.body.images,
         brand: req.body.brand,
         price: req.body.price,
         countInStock: req.body.countInStock,
         category: req.body.category,
         rating: req.body.rating,
         isFeatured: req.body.isFeatured,
         dateCreated: req.body.dateCreated
     })

      await product.save()
     if(!product) {
        res.status(500).json({success: false, message: "Missing required property"})
     }
      else {
        res.send(product)
      }
 })

 // product update
 productRouter.put('/:id', async(req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Missing product')
    }
    const category = await new Category.findById(req.body.category)
    if(!category){return res.status(400).send('Missing category')}

   const product = await Product.findByIdAndUpdate(
    request.params.id,
    {
        name: req.body.name,
         description: req.body.description,
         richDescription: req.body.richDescription,
         image: req.body.image,
         images: req.body.images,
         brand: req.body.brand,
         price: req.body.price,
         countInStock: req.body.countInStock,
         category: req.body.category,
         rating: req.body.rating,
         isFeatured: req.body.isFeatured,
         dateCreated: req.body.dateCreated
    },

    {
        new: true
    }
   )
   if(!product) {
    res.status(500).json({success: false, message: "Cannot update"})
   }
   else {
    res.status(200).send(product)
   }
 })

 // Deleting product
 productRouter.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id)
    .then((Product) => {
        if(Product) {
            res.status(200).json({success: true, message: "successfully deleted a product"})
        }
        else {
            res.status(400).json({success: false, message: "Unable to select product"})
        }
    })
    .catch((err) => {
        res.status(400).json({success: false, message: Error})
    })
 })

 productRouter.put('/gallery-images/:id', 
 uploadOptions.array('image', 10),
 async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Missing product')
    }
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
     let imagesPath = []
     let files = req.file;
     if(files) {
        files.map(file => {
            imagesPath.push(`${basePath}${file.filename}`)
        })
     }
    const product = await Product.findByIdAndUpdate(req.params.id, 
        {
            images: imagesPath
        }, 
        {new: true}

        )
        if(!product) {
            res.status(500).json({success: false, message: "Cannot update"})
           }
           else {
            res.status(200).send(product)
           }
 })

 
 module.exports = productRouter;