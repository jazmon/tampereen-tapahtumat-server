const createTime = (sequelize, DataTypes) => {
  const Time = sequelize.define('Time', {
    start: DataTypes.DATE,
    end: DataTypes.DATE,
  });

  return Time;
};

module.exports = createTime;
