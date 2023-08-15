const express = require('express')
const Category = require('../models/category.model')

const categoryRouter = express.Router()

categoryRouter.get('/', async (req, res) => {
 const categories = await Category.find()
 if(!categories) {
    res.status(500).json({success: false})
 }
 else {
    res.status(200).send(categories)
 }
})

categoryRouter.get('/:id', async (req, res) => {
   const category = await Category.findById(req.params.id)
   if(!category) {
      res.status(500).json({success: false, message: "Category not found!"})
   }
   
   else {
   res.status(200).send(category)
   }
})

categoryRouter.post('/', async(req, res) => {
  const category = await new Category({
   name: req.body.name,
   color: req.body.color,
   icon: req.body.icon
  })
  await category.save()
  if(!category) {
   res.status(500).send({
      success: false,
      error: 'Category not found'
   })
  } else { 
   res.send(category)
}
})

categoryRouter.delete('/:id', (req, res) => {
   Category.findByIdAndRemove(req.params.id)
   .then((Category) => {
      if(Category) {
         res.status(200).json({success: true, message: "Successfully deleted a product"})
      }
      else {
         res.status(404).json({success: false, message: "Category not found"})
      }
   })
   .catch((err) => { 
    return res.status(400).json({success: false, error: err})
})
})

categoryRouter.put('/:id', async(req, res) => {
   const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
         name: req.body.name,
         color: req.body.color,
         icon: req.body.icon
      },

      {
         new: true
      }
      )
   await category.save()
   if(!category) {
      res.status(201).json({success: true, message: "Updated successfully"})
   }
   else {
      res.send(category)
   }
})


module.exports = categoryRouter;