const controllers = {
    users: require('../controllers/usersController')
};

module.exports = app => {
    app.get('/users/all', controllers.users.getAll);
    app.get('/users/:id', controllers.users.getById);
    app.post('/users/new', controllers.users.create);
    app.put('/users/:id', controllers.users.update);
};