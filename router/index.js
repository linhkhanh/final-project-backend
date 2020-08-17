const controllers = {
    users: require('../controllers/usersController')
};

module.exports = app => {
    
    app.get('/users', controllers.users.getAll);
    app.get('/users/:id', controllers.users.getById);

};