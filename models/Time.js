const createTime = (sequelize, DataTypes) => {
  const Time = sequelize.define('Time', {
    start: DataTypes.STRING,
    end: DataTypes.STRING,
  });

  return Time;
};

module.exports = createTime;
