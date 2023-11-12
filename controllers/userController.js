const User = require('../models/userModel');


exports.create = (req, res) => {
	if (
		!req.body.login ||
		!req.body.password ||
		!req.body.email ||
		!req.body.fullName ||
		!req.body.role
	) {
		res.status(400).send({
			message: 'Content cannot be empty!',
		});
		return;
	}
	if (req.body.password !== req.body.passwordConfirmation) {
		res.status(400).send({
			message: 'Passwords are different!',
		});
		return;
	}
	const user = {
		login: req.body.login,
		password: req.body.password,
		email: req.body.email,
		fullName: req.body.fullName,
		role: req.body.role
	};

	User.create(user)
		.then((data) => {
			const token = jwt.sign(
				{ id: data.user_id, login: user.login },
				process.env.secretKey,
				{ expiresIn: process.env.expiresTime }
			);

			res.send({
				message: 'Registration successful',
				token,
				data,
			});
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.massage || 'Some errors while creation the User!!!!',
			});
		});
};


exports.findAll = (req, res) => {
	// const login = req.params.id;

	User.findAll()
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: 'errrrrrrrrrrrrrrrrrrrrrrrrrror',
			});
		});
};

exports.findOne = (req, res) => {
	const id = req.params.user_id;
	User.findByPk(id)
		.then((data) => {
			if (data) res.send(data);
			else {
				res.status(404).send({
					message: `Cannot find the user with id=` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error retreiving the user with id' + id,
			});
		});
};

exports.update = (req, res) => {
	const id = req.params.user_id;

	User.update(req.body, {
		where: { id: id },
	})
		.then((data) => {
			if (data == 1)
				res.send({
					message: 'User was updated successfully!',
				});
			else {
				res.send({
					message: `Cannot update the user with id=` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error updating the user with id' + id,
			});
		});
};

exports.delete = (req, res) => {
	const id = req.params.user_id;

	User.destroy({
		where: { id: id },
	})
		.then((data) => {
			if (data == 1)
				res.send({
					message: 'User was deleted successfully!',
				});
			else {
				res.send({
					message: `Cannot delete the user with id=` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error deleting the user with id' + id,
			});
		});
};

// exports.deleteAll = (req, res) => {
//     User.destroy({
//         where: {},
//         truncate: false
//     })
//         .then((data) => {
//             res.send({
//                 message: data + 'Users was deleted successfully!'
//             });
//         })
//         .catch((err) => {
//             res.status(500).send({
//                 message: err.message || 'Error deleting all users'
//             });
//         });
// };

// exports.findAllPublished = (req, res) => {

// };
