const httpResponseFormatter = require('../formatters/httpResponse');
const bcrypt = require('bcrypt');
const axios = require('axios');
const models = require('../models');
const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
const generator = require('generate-password');

module.exports = {
    async loginSubmit (req, res) {
        try {
            const user = await models.users.findOne({ where: { email: req.body.email } });

            if (!user) {
                httpResponseFormatter.formatOkResponse(res, {
                    err: 'This user doesn\'t exist'
                });
            } else {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    req.session.userId = user.id;
                    console.log(typeof(user.id));
                    console.log(req.session);
                    httpResponseFormatter.formatOkResponse(res, user);
                } else {
                    httpResponseFormatter.formatOkResponse(res, {
                        err: 'password is wrong'
                    });
                }
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
        console.log(req.session);
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
        try {
            const { data } = await axios({
                url: 'https://graph.facebook.com/me',
                method: 'get',
                params: {
                    fields: ['email', 'first_name', 'last_name'].join(','),
                    access_token: req.body.accessToken,
                },
            });

            const user = await models.users.findOne({ where: { email: data.email } });
            if(user) {
                req.session.userId = user.id;
                httpResponseFormatter.formatOkResponse(res, user);
            } else {
                await models.users.create({
                    username: `${data.first_name} ${data.last_name}`,
                    email: data.email,
                    password: generator.generate({
                        length: 10,
                        numbers: true
                    })
                });
                const user = await models.users.findOne({ where: { email: data.email } });
                req.session.userId = user.id;
                httpResponseFormatter.formatOkResponse(res, user);
            }   
           
        } catch (err) {
            console.log(err);
           
            httpResponseFormatter.formatOkResponse(res, {
                err: 'Can not log in with Facebook.'
            });
        }
        
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
        // console.log('response google', res);
        try {
            const { idToken } = req.body;
            client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT
            }).then( async response => {
                const { email_verified, name, email } = response.payload;
                if (email_verified) {
                    // console.log('after email verified', email_verified);
                    try{
                        const user = await models.users.findOne({ where: { email: email } });
                        if (!user) {
                            console.log('no user? ');
                            try{
                                const newUser = await models.users.create({
                                    username: name,
                                    email: email,
                                    password: generator.generate({
                                        length: 10,
                                        numbers: true
                                    })
                                });
                                if(newUser){
                                    req.session.userId = newUser.id;
                                    console.log(req.session);
                                    httpResponseFormatter.formatOkResponse(res, newUser);
                                }
                            } catch(err){
                            // console.log(err);
                                httpResponseFormatter.formatOkResponse(res, {
                                    err: err.message
                                });
                            }
                        }
                        else {
                        // console.log('assign session? ');
                            req.session.userId = user.id;
                            console.log(typeof(user.id));
                            console.log('session after login', req.session);
                            // console.log(user);
                            httpResponseFormatter.formatOkResponse(res, user);
                        }
                    }catch(err){
                        // console.log(err);
                        httpResponseFormatter.formatOkResponse(res, {
                            err: err.message
                        });
                    }
                    
                }
            }).catch(err=>
                console.log(err)
            );
        } catch (err) {
            console.log(err);
            httpResponseFormatter.formatOkResponse(res, {
                err: err.message
            });
        }
    }
};