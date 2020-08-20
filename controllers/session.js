const httpResponseFormatter = require('../formatters/httpResponse');
const bcrypt = require('bcrypt');
const axios = require('axios');
const models = require('../models');
const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT);

module.exports = {
    async loginSubmit (req, res) {
        try {
            const user = await models.users.findOne({ where: { email: req.body.email } });

            if (!user) httpResponseFormatter.formatOkResponse(res, {
                err: 'This user doesn\'t exist'
            });
            if (bcrypt.compareSync(req.body.password, user.password)) {
                req.session.userId = user.id;
                httpResponseFormatter.formatOkResponse(res, user);
            } else {
                httpResponseFormatter.formatOkResponse(res, {
                    err: 'password is wrong'
                });
            }
        } catch (err) {
            console.log(err);
            httpResponseFormatter.formatOkResponse(res, {
                err: err.message
            });
        }
    },
    logOut: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return console.log(err);
            }
            httpResponseFormatter.formatOkResponse(res, {
                message: 'log out'
            });
        });
    },
    async checkAuthentication (req, res) {
        if (req.session.userId) {
            const user = await models.users.findByPk(req.session.userId);
            httpResponseFormatter.formatOkResponse(res, user);
        } else {
            httpResponseFormatter.formatOkResponse(res, {
                message: 'You need to log in to able to access your database.'
            });
        }
    },
    async getDataFacebook (req, res) {
        const { data } = await axios({
            url: 'https://graph.facebook.com/me',
            method: 'get',
            params: {
                fields: ['email', 'first_name', 'last_name'].join(','),
                access_token: req.body.accessToken,
            },
        });
        httpResponseFormatter.formatOkResponse(res, data);
    },
    async logInWithFbOrGoogle (req, res) {
        try {
            const user = await models.users.findOne({ where: { email: req.body.email } });
            req.session.userId = user.id;
            httpResponseFormatter.formatOkResponse(res, user);
        } catch (err) {
            console.log(err);
            httpResponseFormatter.formatOkResponse(res, {
                err: 'This user doesn\'t exist'
            });
        }
    },

    async logInWithGoogle (req, res) {
        try{
            const { idToken } = req.body;
            client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT
            }).then( response =>{
                const { email_verified, name, email } = response.payload;
                if (email_verified){
                    // console.log('valid google email');
                    // console.log('name', name);
                    // console.log('email', email);
                    httpResponseFormatter.formatOkResponse(res, email);
                    // res.send('ok');
                }
            });
        }catch (err) {
            console.log(err);
            httpResponseFormatter.formatOkResponse(res, {
                err: err.message
            });
        }
    } 
};