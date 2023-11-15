const Category = require('../models/categoryModel');

exports.getAllCategories = (req, res) => {
    Category.findAll()
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: 'errrrrrrrrrrrrrrrrrrrrrrrrrror',
			});
		});
};

exports.getCategory = (req, res) => {
    const id = req.params.category_id;
	Category.findByPk(id)
		.then((data) => {
			if (data) res.send(data);
			else {
				res.status(404).send({
					message: `Cannot find the category with id=` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error retreiving the category with id' + id,
			});
		});
};

exports.getCategoryPosts = (req, res) => {};

exports.createCategory = (req, res) => {
	if (!req.body.title) {
		res.status(400).send({
			message: 'Fields cannot be empty!',
		});
		return;
	}

	const category = {
		title: req.body.title,
	};
	Category.create(category)
		.then((data) => {
			res.send({
				message: 'Category creation successful',
				data,
			});
		})
		.catch((err) => {
			console.error('Sequelize Error:', err);
			res.status(500).send({
				message:
					err.massage || 'Some errors while creation the Category!',
			});
		});
};

exports.updateCategory = (req, res) => {
    const id = req.params.category_id;
	Category.update(req.body, {
		where: { category_id: id },
	})
		.then((data) => {
			if (data == 1)
				res.send({
					message: 'Category was updated successfully!',
				});
			else {
				res.send({
					message: `Cannot update the Category with id=` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error updating the Category with id ' + id,
			});
		});
};

exports.deleteCategory = (req, res) => {
    const id = req.params.category_id;

	Category.destroy({
		where: { category_id: id },
	})
		.then((data) => {
			if (data == 1)
				res.send({
					message: 'Category was deleted successfully!',
				});
			else {
				res.send({
					message: `Cannot delete the Category with id=` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error deleting the Category with id=' + id,
			});
		});
};
