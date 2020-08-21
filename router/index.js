const controllers = {
    users: require('../controllers/usersController'),
    session: require('../controllers/session'),
    accounts: require('../controllers/accountsController')
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

    // get all accounts by user id
    app.get('/users/:id/accounts', controllers.users.getAllAccounts);

    // get all transactions by user id
    app.get('/users/:id/transactions', controllers.users.getAllTransactions);

    // get all transactions by account id
    app.get('/accounts/:id/transactions', controllers.accounts.getAllTransactions);

    // create new user
    app.post('/users/new', controllers.users.create);

    // login
    app.post('/users/login', controllers.session.loginSubmit);

    // google.login
    app.post('/users/googlelogin', controllers.session.logInWithGoogle);

    // get data from facebook
    app.post('users/get_data_fb', controllers.session.getDataFacebook);

    // log in with fb-google
    app.post('/users/log_in_fb_google', controllers.session.logInWithFbOrGoogle);

    // CREATE NEW ACCOUNT
    app.post('/accounts/new', controllers.accounts.create);

    //update user by id
    app.put('/users/:id', controllers.users.update);

    // update Name of ACCOUNT by id
    app.put('/accounts/:id', controllers.accounts.update);

    // delete account by id
    app.delete('/accounts/:id', controllers.accounts.remove);
};