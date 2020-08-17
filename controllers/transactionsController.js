const  models  = require('../models');
const { getIdParam } = require('./helper');
const httpResponseFormatter = require('../formatters/httpResponse');

async function getAll(req, res) {
    const transactions = await models.transactions.findAll();
    httpResponseFormatter.formatOkResponse(res, transactions);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const transaction = await models.transactions.findByPk(id);
	if (transaction) {
        httpResponseFormatter.formatOkResponse(res, transaction);
	} else {
        httpResponseFormatter.formatOkResponse(res, {message: "This one doen't exist."});
	}
};

async function create(req, res) {
	if (req.body.id) {
        httpResponseFormatter.formatOkResponse(res, {message: "ID should not be provided, since it is determined automatically by the database."});
	} else {
		await models.transactions.create(req.body);
		httpResponseFormatter.formatOkResponse(res, {message: "A new transaction is created."});
	}
};

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		await models.transactions.update(req.body, {
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
	await models.transactions.destroy({
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