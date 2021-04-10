var moment = require('moment');
const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    fullname: req.body.fullname,
    gender: req.body.gender,
    birthDate: moment(new Date(req.body.dateBirth)).format('MM/DD/YYYY'),
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      	user.setRoles([1]);
		res.status(201)
			.send({
				success: false,
				message: 'USER_CREATED',
			});
    })
    .catch(err => {
		res.status(500).send({ success: false, message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
		return res.status(404).send({ success: false, message: "USER_NOT_FOUND" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
			success: false,
			message: "INVALID_CRADENTIALS"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400x30 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
			success: true,
			message: "LOGGED_IN",
			user: {
				id: user.id,
				email: user.email,
				roles: authorities
			},
			accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ success: false, message: err.message });
    });
};
