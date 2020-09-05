const controllers = {
    users: require('../controllers/usersController'),
    session: require('../controllers/session'),
    accounts: require('../controllers/accountsController'),
    transactions: require('../controllers/transactionsController'),
    categories: require('../controllers/categoriesController')
};

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports = app => {

    // check Authentication
    app.get('/check_authentication', controllers.session.checkAuthentication);

    //get all users
    app.get('/users/all', controllers.users.getAll);

    // logout
    app.get('/users/logout', controllers.session.logOut);

    // get categories by income
    app.get('/categories/income', controllers.categories.getByIncome);

    // get categories by expense
    app.get('/categories/expense', controllers.categories.getByExpense);

    // get categories by id
    app.get('/categories/:id', controllers.categories.getById);

    //get user by Id
    app.get('/users/:id', controllers.users.getById);

    //get account by id
    app.get('/accounts/:id', controllers.accounts.getById);
    
    // get transaction by id
    app.get('/transactions/:id', controllers.transactions.getById);

    // get category by id
    app.get('/categories/:id', controllers.categories.getById);

    // get all accounts by user id
    app.get('/users/:id/accounts', controllers.accounts.getAllAccounts);

    // get all transactions by user id
    app.get('/users/:id/transactions', controllers.transactions.getAllTransactionsByUserId);

    // get all transactions by account id
    app.get('/accounts/:id/transactions', controllers.transactions.getAllTransactionsByAccountId);

    // calculate total money by categories 
    app.get('/users/:id/categories/income', controllers.categories.calculateMoneyIncome);

    // calculate total money by categories 
    app.get('/users/:id/categories/expense', controllers.categories.calculateMoneyExpense);

    // calculate credit, debit and balance of all accounts
    app.get('/users/:id/accounts/statistic', controllers.transactions.calculateBalance);

    // calculate balance of each account
    app.get('/users/:id/accounts/statistic/each', controllers.transactions.eachAccount);

    // calculate transactions type income 
    app.get('/users/:id/transactions/income', controllers.transactions.calculateTransactionsIncome);

    // calculate transactions type expense
    app.get('/users/:id/transactions/expense', controllers.transactions.calculateTransactionsExpense);

    // get All transactions by categories id
    app.get('/transactions/categories/:id', controllers.transactions.getAllTransactionsByCatID);

    // create new user
    app.post('/users/new', controllers.users.create);

    // login
    app.post('/users/login', controllers.session.loginSubmit);

    // google.login
    app.post('/users/googlelogin', controllers.session.logInWithGoogle);

    // get data from facebook
    app.post('/users/get_data_fb', controllers.session.getDataFacebook);

    // log in with fb-google
    app.post('/users/log_in_fb_google', controllers.session.logInWithFbOrGoogle);

    // Import statement
    app.post('/users/import', upload.single('file'), controllers.users.importStatement);

    // Training data
    app.post('/users/training', upload.single('file'), controllers.users.importTrainingData);

    // Get filtered transactions
    app.post('/transactions/filter', controllers.transactions.filterTransactions);

    // CREATE NEW ACCOUNT
    app.post('/accounts/new', controllers.accounts.create);

    // create NEW TRANSACTION
    app.post('/transactions/new', controllers.transactions.create);

    // CREATE NEW CATEGORIES
    app.post('/categories/new', controllers.categories.create);

    //update user by id
    app.put('/users/:id', controllers.users.update);

    // update Name of ACCOUNT by id
    app.put('/accounts/:id', controllers.accounts.update);

    // update Name and type of Category
    app.put('/categories/:id', controllers.categories.update);

    // edit transaction 
    app.put('/transactions/:id', controllers.transactions.update);

    // delete account by id
    app.delete('/accounts/:id', controllers.accounts.remove);

    // delete transaction
    app.delete('/transactions/:id', controllers.transactions.remove);

    // delete category by id 
    app.delete('/categories/:id', controllers.categories.remove);
};