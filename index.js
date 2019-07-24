const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    secret: "Secret123",
}));

mongoose.connect('mongodb+srv://akira:akira6@cluster0-xbelx.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true}, 
    error => console.error(error));

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'view'));

app.use('/',indexRouter);
app.use('/user',userRouter);



app.listen(3000,() => {
    console.log("Server started on port 3000");
})