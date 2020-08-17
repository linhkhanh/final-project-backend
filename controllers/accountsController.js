const  models  = require('../models');
const { getIdParam } = require('./helper');
const httpResponseFormatter = require('../formatters/httpResponse');

async function getAll(req, res) {
    const accounts = await models.accounts.findAll();
    httpResponseFormatter.formatOkResponse(res, accounts);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const account = await models.accounts.findByPk(id);
	if (account) {
        httpResponseFormatter.formatOkResponse(res, account);
	} else {
        httpResponseFormatter.formatOkResponse(res, {message: "This account doen't exist."});
	}
};

async function create(req, res) {
	if (req.body.id) {
        httpResponseFormatter.formatOkResponse(res, {message: "ID should not be provided, since it is determined automatically by the database."});
	} else {
		await models.accounts.create(req.body);
		httpResponseFormatter.formatOkResponse(res, {message: "A new account is created."});
	}
};

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		await models.accounts.update(req.body, {
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
	await models.accounts.destroy({
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
	remove
};