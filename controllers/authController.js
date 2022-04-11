const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const nodemailer = require("../config/nodemailer.config");

/**
 * Functionality: create a new user
 * Usage(URL): /auth/signup
 * method: Post
 * Parameter: {
 *       email,
 *       password,
 *       name,
 * }
 * Response Data: {
 *       _id
 * }
 * Message Code: -1 Email already be registered
 *               -2 Database Saving Error
 *               -3 Server Error
 *                0 Success
 */
async function signup(req, res) {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				res.status(409).json({
					code: -1,
					msg: "Email has already been registered!",
				});
			} else {
				console.log(req.body.email);
				// const token = jwt.sign({email: req.body.email}, "weareaos!!!");
				const user = new User({
					email: req.body.email,
					password: req.body.password,
					name: req.body.name,
					// status: req.body.status,
					// confirmationCode: token,
				});
				user.save((err) => {
					if (err) {
						res.json({ code: -2, msg: err });
						console.log(err);
						return;
					} else {
						res.json({
							code: 0,
							msg: "Successfully Signup!",
							data: {
								_id: user._id,
								email: user.email,
							},
						});
					}
				});
				// if (req.body.status != "Active") {
				// 	nodemailer.sendConfirmationEmail(
				// 		req.body.firstname,
				// 		req.body.email,
				// 		user._id,
				// 		token,
				// 	);
				// }
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

/**
 * Functionality: login
 * Usage(URL): /auth/login
 * method: Post
 * Parameter: {
 *       email,
 *       password,
 * }
 * Response Data: {
 *       _id
 * }
 * Message Code: -1 incorrect password
 *               -2 the user doesn't exist
 *               -3 Server Error
 *                0 Success
 */
async function login(req, res) {
	user = await User.findOne({
		email: req.body.email,
	});
	// console.log('hi')
	// found the user with correct email
	if (user) {
		// console.log('inside if')
		try {
			let isValidPassword = req.body.password == user.password;
			if (isValidPassword) {
				// if (user.status == "Active") {
					// user.loginStatus = true;
					// user.save();
					res.status(200).json({
						code: 0,
						msg: "Login Success!",
						data: {
							_id: user._id,
						},
					});
				// } else {
				// 	res.json({
				// 		code: -4,
				// 		msg: "Your account is still pending",
				// 	});
				// 	console("pending!");
				// }
				}else {
				res.json({
					code: -1,
					msg: "Password!",
				});
				console("password!");
			}
		} catch (err) {
			res.json({
				code: -3,
				msg: "some errors happened",
			});
			console.log(err);
		}
		// the wrong login credentials
	} else {
		res.json({
			code: -2,
			msg: "User does not exist",
			data: { user: user, email: req.body.email },
		});
		return;
	}
}

/**
 * Functionality: logout
 * Usage(URL): /auth/logout
 * method: Patch
 * Parameter: {
 *       email,
 * }
 * Response Data: {
 *       email
 * }
 * Message Code:
 *                0 Success
 */
const logout = async function (req, res) {
	user = await User.findOne({ email: req.body.email });
	if (user) {
		user.loginStatus = false;
		user.save();
		res.status(200).json({
			code: 0,
			msg: "Logout Success!",
			data: {
				email: user.email,
				// token: token,
			},
		});
	}
};
exports.login = login;
exports.signup = signup;
exports.logout = logout;
