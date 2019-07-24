const express = require('express');
const router = express.Router();
const userModel = require('../models/user');

router.get('/login', (request,response) => {
    response.render('login', {
        errors: []
    });
});

router.get('/register', (request, response) => {
    response.render('register', {
        errors: []
    });
});

router.get('/logout', (request, response) => {
    request.session.destroy();
    response.redirect('/user/login');
});

router.post('/register', (request, response) => {
    if(request.body.email && request.body.password && request.body.name) {
        if(request.body.password.trim().length > 5) {
            const user = new userModel({
                name: request.body.name,
                email: request.body.email,
                password: request.body.password
            });
            userModel.findOne({email: request.body.email}, (err, result) => {
                if(err) {
                    console.log(err);
                }
                if(result) {
                    response.render('register', {
                        errors: ['Email ID already exists!']
                    })
                } else {
                    user.save((err, doc) => {
                        if(err) {
                            res.render('register', {
                                errors: [error]
                            })
                        }
                        if(doc) {
                            response.redirect('/user/login');
                        }
                    })
                }
            })
        } else {
            response.render('register', {
                errors: ['Password should be more than 5 characters.']
            });
        }
    } else {
        const error = [];
        if( !request.body.email) {
            error.push("Enter your email address.");
        }
        if(!request.body.password) {
            error.push("Enter your password.");
        }
        if(!request.body.name) {
            error.push("Enter your name.");
        }
        response.render('register', {
            errors: error
        });
    }
});

module.exports = router;