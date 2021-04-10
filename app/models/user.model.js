module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
	fullname: {
		type: Sequelize.STRING
	},
	gender: {
		type: Sequelize.INTEGER
	},
	birthDate: {
		type: Sequelize.DATEONLY
	},
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return User;
};
