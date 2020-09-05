const models = require('../models');
const httpResponseFormatter = require('../formatters/httpResponse');
const { getIdParam, hashPassword, getAllTransactionsByUserId } = require('./helper');
const moment = require('moment');
const bayes = require('bayes');
const classifier = bayes();
const csv = require('csv-parser');
const fs = require('fs');

async function getAll(req, res) {
	if (req.session.userId) {
		const users = await models.users.findAll();
		httpResponseFormatter.formatOkResponse(res, users);
	} else {
		httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in' });
	}
}

async function getById(req, res) {
	const id = getIdParam(req);
	if (req.session.userId) {
		try {
			const user = await models.users.findByPk(id);
			httpResponseFormatter.formatOkResponse(res, user);
		} catch (err) {
			httpResponseFormatter.formatOkResponse(res, { message: err.message });
		}

	} else {
		httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in.' });
	}
}

async function getByEmail(req, res) {
	const user = await models.users.findOne({ where: { email: req.body.email } });
	if (user) {
		httpResponseFormatter.formatOkResponse(res, user);
	} else {
		httpResponseFormatter.formatOkResponse(res, { message: 'This user doen\'t exist.' });
	}
}

async function create(req, res) {
	if (req.body.id) {
		httpResponseFormatter.formatOkResponse(res, { message: 'ID should not be provided, since it is determined automatically by the database.' });
	} else {
		try {
			req.body.password = hashPassword(req.body.password);
			await models.users.create(req.body);
			httpResponseFormatter.formatOkResponse(res, { message: 'A new user is created.' });
		} catch (err) {
			httpResponseFormatter.formatOkResponse(res, { err: 'This email is used already. Please choose another one.' });
		}

	}
}

async function update(req, res) {
	if (req.session.userId) {
		const id = getIdParam(req);
		if (req.session.userId === id) {
			req.body.password = hashPassword(req.body.password);
			await models.users.update(req.body, {
				where: {
					id: id
				}
			});
			httpResponseFormatter.formatOkResponse(res, { message: 'Update successfully.' });
		} else {
			httpResponseFormatter.formatOkResponse(res, { message: 'You can not do this action' });
		}
	} else {
		httpResponseFormatter.formatOkResponse(res, { message: 'You need to log in.' });
	}

}

async function remove(req, res) {
	const id = getIdParam(req);
	await models.users.destroy({
		where: {
			id: id
		}
	});
	httpResponseFormatter.formatOkResponse(res, { message: 'Delete successfully.' });
}

async function findCategoryId(allCategories, name) {
	const category = allCategories.find(item => item.name.toLowerCase() === name.toLowerCase());
	return category.id;
}

async function importStatement(req, res, next) {
	if (req.session.userId) {
		try {
			const results = [];
			const editedResult = [];
			
			const allCategories = await models.categories.findAll();
			const categoriesIncome = await models.categories.findAll({
				where: {
					type: "income"
				}
			});

			const categoriesExpense = await models.categories.findAll({
				where: {
					type: "expense"
				}
			});

			const stateJson = await models.trainingData.findOne({
				order: [['createdAt', 'DESC']]
			});
			const revivedClassifier = bayes.fromJson(stateJson.data);

			fs.createReadStream(req.file.path)
				.pipe(csv(['date', 'description', 'amount', 'empty', 'account']))
				.on('data', (data) => results.push(data))
				.on('end', async () => {
					// console.log(results);
					for (let i = 0; i < results.length; i++) {
						const categoryName = await revivedClassifier.categorize(results[i].description);
						const categoryId = await findCategoryId(allCategories, categoryName);
						if (!categoryId) results[i].amount < 0 ? categoryId = categoriesExpense[10] : categoryId = categoriesIncome[3];
						editedResult.push({
							amount: (Math.abs(results[i].amount) * 100).toFixed(0),
							description: results[i].description,
							paidAt: moment(results[i].date, 'DD/MM/YYYY', true).format(),
							accountId: +req.body.accountId,
							categoryId: categoryId,
							userId: req.session.userId
						})
					}
					// add to transactions table	
					await models.transactions.bulkCreate(editedResult);
				});

			httpResponseFormatter.formatOkResponse(res, {
				message: "Import data successfully.",
			});
		} catch (error) {
			console.log(error);
			httpResponseFormatter.formatOkResponse(res, {
				message: error.message,
			});
		}
	} else {
		httpResponseFormatter.formatOkResponse(res, {
			message: "you need to log in",
		});
	}
}

async function importTrainingData(req, res, next) {
	try {
		console.log(req.file);
		const results = [];
		const stateJson = await models.trainingData.findOne({
			order: [['createdAt', 'DESC']]
		});

		if (stateJson) {
			const revivedClassifier = bayes.fromJson(stateJson.data);

			fs.createReadStream(req.file.path)
				.pipe(csv(['date', 'description', 'amount', 'empty', 'account', 'category']))
				.on('data', (data) => results.push(data))
				.on('end', async () => {
					// console.log(results);

					for (let i = 0; i < results.length; i++) {
						await revivedClassifier.learn(results[i].description, results[i].category)
					}

					const newStateJson = revivedClassifier.toJson();
					await models.trainingData.create({ data: newStateJson });
				});
		} else {

			fs.createReadStream(req.file.path)
				.pipe(csv(['date', 'description', 'amount', 'empty', 'account', 'category']))
				.on('data', (data) => results.push(data))
				.on('end', async () => {
					// console.log(results);

					for (let i = 0; i < results.length; i++) {
						await classifier.learn(results[i].description, results[i].category)
					}

					const newStateJson = classifier.toJson();
					await models.trainingData.create({ data: newStateJson });
				});
		}
		httpResponseFormatter.formatOkResponse(res, {
			message: "Import data successfully.",
		});

	} catch (err) {
		console.log(err);
		httpResponseFormatter.formatOkResponse(res, {
			message: err.message,
		});
	}
}

module.exports = {
	getAll,
	getById,
	getByEmail,
	create,
	update,
	remove,
	importStatement,
	importTrainingData
};