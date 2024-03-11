const { User } = require('../models/user');
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    try {
        const userList = await User.find().select('-passwordHash');

        if (!userList || userList.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Users not found'
            });
        }

        res.send(userList);
    } catch (error) {
        console.error("Error getting user list:", error);
        res.status(500).json({
            success: false,
            message: 'Error internal server.'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'The user with the given ID was not found.'
            });
        }

        res.status(200).send(user);
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({
            success: false,
            message: 'Error internal server'
        });
    }
});

router.post('/', async(req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        color: req.body.color,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });

    user = await user.save()

    if(!user){
        return res.status(400).send()
    }

    res.send(user);
})

router.post('/login', async(req, res) => {
    const user = await User.findOne({ email: req.body.email })
    const secret = process.env.SECRET;

    if(!user){
        return res.status(400).send('The user not found')
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
            userId: user.id,
            isAdmin: user.isAdmin
        }, secret, { expiresIn: '1d'})

        res.status(200).send({ user: user.email, token: token})
    } else{
        res.status(400).send('password is wrong')
    }
})

router.get('/get/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments();

        if (!userCount) {
            return res.status(500).json({
                success: false
            });
        }

        res.send({
            userCount: userCount
        });
    } catch (error) {
        console.error("Error al obtener el conteo de productos:", error);
        res.status(500).json({
            success: false,
            message: "Ocurrió un error al obtener el conteo de productos. Por favor, inténtelo de nuevo más tarde."
        });
    }
});

router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(
        user => {
            if(user){
                return res.status(200).json({
                    success: true,
                    message: ' the user is deleted'
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'user not found'
                })
            }
        }
    ).catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})

module.exports = router;