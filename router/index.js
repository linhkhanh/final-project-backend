const controllers = {
    users: require('../controllers/usersController'),
    session: require('../controllers/session')
};

module.exports = app => {

    // check Authentication
    app.get('/check_authentication', controllers.session.checkAuthentication);

    //get all users
    app.get('/users/all', controllers.users.getAll);

    // logout
    app.get('/users/logout', controllers.session.logOut);

    //get user by Id
    app.get('/users/:id', controllers.users.getById);

    // create new user
    app.post('/users/new', controllers.users.create);

    // login
    app.post('/users/login', controllers.session.loginSubmit);

    // google.login
    app.post('/users/googlelogin', controllers.session.logInWithGoogle);

    app.post('/users/log_in_fb_google', controllers.session.logInWithFbOrGoogle);

    //update user by id
    app.put('/users/:id', controllers.users.update);
};