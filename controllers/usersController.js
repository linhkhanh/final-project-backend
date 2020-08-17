const { models } = require('../models');
const { getIdParam } = require('./helper');

async function getAll(req, res) {
	const users = await models.users.findAll();
    httpResponseFormatter.formatOkResponse(res, users);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const user = await models.users.findByPk(id);
	if (user) {
        httpResponseFormatter.formatOkResponse(res, user);
	} else {
        httpResponseFormatter.formatOkResponse(res, {message: "This user doen't exist."});
	}
};

async function create(req, res) {
	if (req.body.id) {
        httpResponseFormatter.formatOkResponse(res, {message: "ID should not be provided, since it is determined automatically by the database."});
	} else {
		await models.users.create(req.body);
		httpResponseFormatter.formatOkResponse(res, {message: "A new user is created."});
	}
};

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		await models.users.update(req.body, {
			where: {
				id: id
			}
		});
		httpResponseFormatter.formatOkResponse(res, {message: "Update successfully."});
	} else {
        httpResponseFormatter.formatOkResponse(res, {message: `param ID (${id}) does not match body ID (${req.body.id}).`});
	}
};

async function remove(req, res) {
	const id = getIdParam(req);
	await models.users.destroy({
		where: {
			id: id
		}
	});
	httpResponseFormatter.formatOkResponse(res, {message: "Delete successfully."});
};

module.exports = {
	getAll,
	getById,
	create,
	update,
	remove,
};