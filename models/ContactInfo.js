const createContactInfo = (sequelize, DataTypes) => {
  const ContactInfo = sequelize.define('ContactInfo', {
    address: {
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
    link: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return ContactInfo;
};

export default createContactInfo;

/*
  address: ?string;
  email: ?string;
  phone: ?string;
  link: ?string;
  companyName: ?string;
*/
