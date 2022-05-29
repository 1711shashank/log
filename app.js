const { userDataBase } = require('./mongoDB');
const { generateToken } = require('./generator');

const express = require("express");
var cors = require('cors');
var cookieParser = require('cookie-parser');
const { urlencoded } = require("express");

const app = express();

app.use(cors({ origin: true, optionsSuccessStatus: 200, credentials: true }));
app.options("*", cors({ origin: true, optionsSuccessStatus: 200, credentials: true }));
app.use(express.json(), cookieParser());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000
app.listen(port);

app.post('/login', login);
app.post('/logout', logout);

async function login(req, res) {
    try {

        let dataObj = req.body;
        if (dataObj.email && dataObj.password) {
            let user = await userDataBase.findOne({ email: dataObj.email })
            if (user) {


                let isVaildPassword = (user.password === dataObj.password);

                if (isVaildPassword) {

                    const authToken = user.createAuthToken();
                    user.save();

                    res.cookie("authToken", authToken);

                    res.status(200).json({
                        message: 'LogIn Successfully',
                        statusCode: 200
                    })
                } else {
                    res.status(401).json({
                        message: 'Invalid Password',
                        statusCode: 401
                    })
                }
            } else {
                res.status(403).json({
                    message: 'User does not exist',
                    statusCode: 403
                })
            }
        } else {
            return res.status(400).json({
                message: 'Wrong credantials',
                statusCode: 400
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            statusCode: 500
        })
    }
}


async function logout(req, res) {

    let temp = await req.cookies;

    console.log("Read Cookies :", temp.authToken);

    let user = await userDataBase.findOne({ authToken: temp.authToken })
    if (user) {
        user.deleteAuthToekn();
        user.save();
    }
    res.status(200).json({
        message: 'LogOut Successfully',
        statusCode: 200
    })

}