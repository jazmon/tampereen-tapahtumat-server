const createFormContactInfo = (sequelize, DataTypes) => {
  const FormContactInfo = sequelize.define('FormContactInfo', {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return FormContactInfo;
};

export default createFormContactInfo;

/*
  email: ?string;
  phone: ?string;
  name: ?string;
  jobTitle: ?string;
*/
