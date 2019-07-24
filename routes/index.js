const express = require('express');
const router = express.Router();
const itemModel = require('../models/item');
const userModel = require('../models/user');

router.post('/',(request,response) => {
    if(request.body.email && request.body.password) {
        if(request.body.password.trim().length > 5) {
            userModel.findOne({email: request.body.email, password: request.body.password}, (err, result) => {
                if(err) {
                    console.log(err);
                }
                if(result) {
                    request.session.user = result;
                    console.log(result);
                    response.redirect('/');      
                } else {
                    response.render('login', {
                        errors: ['Invalid email id - password combination.']
                    })
                }
            })
        } else {
            response.render('login', {
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
        response.render('login', {
            errors: error
        });
    }
});

function sessionCheck(req, res, next) {
    if(req.session.user) {
        next();
    } else {
        res.redirect('/user/login');
    }
}

router.get('/', sessionCheck, (request,response) => {
    itemModel.find({
        user: request.session.user.email
    }, (err, res) => {
        if(err) {
            console.log(err);
        }
        if(res) {
            console.log(res);
            response.render("todo", {
                items: res,
                user: request.session.user
            });
        }
    })
});

router.post('/edit', sessionCheck, (request,response) => {
    if(request.body.oldItem && request.body.newItem) {
        const {oldItem, newItem} = request.body;
        itemModel.findOneAndUpdate({item: oldItem}, {item: newItem}, (err, doc, res) => {
            if(err) {
                response.sendStatus(400);
            }
            if(doc) {
                response.sendStatus(200);
            }
        })
    }
})

router.post('/delete', sessionCheck, (request,response) => {
    if(request.body.item) {
        itemModel.remove({item: request.body.item}, (err) => console.log(err))
        response.sendStatus(200);
    }       
    else {
        response.sendStatus(400);
    }
});

router.post('/add', sessionCheck,(request,response) => {
    console.log(request.body);

    const array = request.body.item.split(',');
    if(request.body.item){
        const item = new itemModel({
            item: request.body.item,
            user: request.session.user.email
        });
        item.save();
        response.sendStatus(200);
    }
    else{
        response.sendStatus(400);
    }
});

module.exports = router;