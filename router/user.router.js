const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const userRouter = express.Router()

userRouter.get('/', async (req, res) => {
  const userList = await User.find().select('-passwordHash')
    if(!userList) {
      res.status(500).json({success: false, message: 'error'})
    }
    else {
      res.status(200).send(userList)
    }
  })

  userRouter.get('/get/count', async (req, res) => {
    const userCount = await User.countDocuments((count) => count)
    if(!userCount) {
        res.status(500).json({
            success: false
        })
    } else { 
        res.send({
            userCount: userCount 
        })
    }      
})

  userRouter.get('/:id', async (req, res) => {
     const user = await User.findById(req.params.id).select('-passwordHash')
     if(!user) {
      res.status(500).json({success: false, message: 'Error'})
     }

     else {
      res.status(200).send(user)
     }
  })

  userRouter.put('/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
    },
    {
      new: true
    }
    )
    if(!user) {
      res.status(400).json({success: false, message: "Cannot update"})
    }
    else {
      res.status(200).send(user)
    }
  })

  userRouter.post('/', async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      street: req.body.street,
      isAdmin: req.body.isAdmin,
      apartment: req.body.apartment,
      zip: req.body.zip,
      country: req.body.country, 
      city: req.body.city
    })

     await user.save()

    if(!user) {
      res.status(400).json({success: false, message: 'User cannot be created'})
    }
     
     return res.status(201).send(user)
  
  })

  userRouter.post('/register', async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      street: req.body.street,
      isAdmin: req.body.isAdmin,
      apartment: req.body.apartment,
      zip: req.body.zip,
      country: req.body.country, 
      city: req.body.city
    })

     await user.save()

    if(!user) {
      res.status(400).json({success: false, message: 'User cannot be created'})
    }
     
     return res.status(200).send(user)
  
  })

  userRouter.post('/login', async (req, res) => {
     const user = await User.findOne({email: req.body.email})

     const secret = process.env.secret

     if(!user) {
      return res.status(400).json({success: false, message: 'Invalid email or password'})
     }
     if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    
      const token = jwt.sign({
       userId: user.id,
       isAdmin: user.isAdmin
      },
      secret,
      {expiresIn: '1d'}
      )
      return res.status(200).send({user: user.email, token: token})
     }

     else {
      res.status(400).send('Invalid password')
     }
     
  })

  userRouter.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then((user) => {
        if(user) {
            res.status(200).json({success: true, message: "successfully deleted a user"})
        }
        else {
            res.status(400).json({success: false, message: "Unable to selete user"})
        }
    })
    .catch((err) => {
        res.status(400).json({success: false, message: Error})
    })
 })


  module.exports = userRouter;