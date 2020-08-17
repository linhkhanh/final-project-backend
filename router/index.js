const controllers = {
	users: require('../controllers/usersController')
};

module.exports = app => {
    app.get('/', controllers.users.getAll);

};