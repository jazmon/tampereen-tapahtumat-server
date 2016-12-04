const createImage = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    title: DataTypes.STRING,
    uri: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
  });

  return Image;
};

module.exports = createImage;
