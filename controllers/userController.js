
// userTotalSpending --
// now we only have expense collection and expenseTotal is calculated in expense controller
// but later we would have more collections such as transport/ shops ect
// the total expense will need to add them as well


const User = require("../models/user.model");


/**
 * Functionality: GET user with its information
 * Usage(URL): /user/profile/:id   
 * Usage: profile page - display user profile
 */
const getUser = async (req, res) => {
	User.findById(req.params.id)
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => res.status(400).json(`Error` + err));
};


/**
 * Functionality: Update  User Profile information
 * Usage(URL): /user/updateProfile/:id                     
 * method: Post
 * Parameter: {
 *       name,
 *       password,
 *       agent_voice,
 * }
 * Response Data: {
 *       "user updated"
 * }
 */
const updateUserProfile = async (req, res) => {
	await User.findById(req.params.id)
		.then((user) => {
            if (req.body.name) {
				user.name = req.body.name;
			}
			if (req.body.password) {
				user.password = req.body.password;
			}
            if (req.body.agent_voice) {
				user.agent_voice = req.body.agent_voice;
			}

			user.save()
				.then(() => res.status(200).json(user))
				.catch((err) => res.json("Error: " + err));
		})
		.catch((err) => res.json("Error: " + err));
};

module.exports = {
	getUser,
    updateUserProfile
};