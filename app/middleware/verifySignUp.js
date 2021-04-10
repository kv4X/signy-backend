const validator = require('../helpers/validate');
const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

validateInput = (req, res, next) => {
	const validationRule = {
		"email": "required|email",
        "fullname": "required|string",
        "password": "required|string|min:6|confirmed", // provjerava dal se podudara sa password_confirmation
        "gender": "required|max:1|integer",
        "dateBirth": "required|date",
    }
	console.log(req.body);
    validator(req.body, validationRule, {}, (err, status) => {
        if(!status){
            res.status(412)
                .send({
                    success: false,
                    message: 'VALIDATION_ERROR',
                    data: err
                });
        }else{
            next();
        }
    });
};

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if(user){
        res.status(400)
			.send({
				success: false,
				message: "EMAIL_TAKEN"
			});
        return;
      }

      next();
    });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400)
			.send({
				success: false,
				message: "ROLE_ERROR"
			});
        return;
      }
    }
  }
  
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
  validateInput: validateInput
};

module.exports = verifySignUp;
