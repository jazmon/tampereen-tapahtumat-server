const createTime = (sequelize, DataTypes) => {
  const Time = sequelize.define('Time', {
    start: DataTypes.BIGINT,
    end: DataTypes.BIGINT,
  });

  return Time;
};

module.exports = createTime;
