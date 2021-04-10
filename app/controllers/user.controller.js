var moment = require('moment');
const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");

exports.updateProfile = (req, res) => {
	User.update({
		  firstname: user.firstname,
		  lastname: user.lastname,
		  address: user.address,
		  phoneNumber: user.phoneNumber,
		  gender: user.gender,
		  birthDate: user.birthDate,
		  jmbg: user.jmbg
	},{
		where: {
			id: req.userId
		}
	})
   .then(num => {   
		if(num == 1){
			res.status(200).send({
				success: true,
				message: "PROFILE_UPDATED",
			});
		}else{
			res.status(500).send({
				success: false,
				message: "ERROR",
			});
		}
    })
    .catch(err => {
		res.status(500).send({ success: false, message: err.message });
    });
};

exports.updatePassword = (req, res) => {
	User.findOne({
		where: {
			id: req.userId
		}
	})
    .then(user => {
		if (!user) {
			return res.status(404).send({ success: false, message: "USER_NOT_FOUND" });
		}

		var passwordIsValid = bcrypt.compareSync(
			req.body.currentPassword,
			user.password
		);

		if(!passwordIsValid) {
			return res.status(401).send({
				success: false,
				message: "CURRENT_PASSWORD_INCORRECT"
			});
		}
		
		User.update({
			password: bcrypt.hashSync(req.body.password, 8),
		},{
			where: {
				id: req.userId
			}
		})
	   .then(num => {
		   
			if(num == 1){
				res.status(200).send({
					success: true,
					message: "PASSWORD_UPDATED",
				});
			}else{
				res.status(500).send({
					success: false,
					message: "ERROR",
				});
			}
		})
		.catch(err => {
			res.status(500).send({ success: false, message: err.message });
		});
		
	  
	})
	.catch(err => {
		res.status(500).send({ success: false, message: err.message });
    });
};