const createEvent = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    apiID: {
      type: DataTypes.STRING,
      unique: true,
      alloNull: false,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    latitude: {
      type: DataTypes.REAL,
      allowNull: true,
      defaultValue: null,
      validate: { min: -90, max: 90 },
    },
    longitude: {
      type: DataTypes.REAL,
      allowNull: true,
      defaultValue: null,
      validate: { min: -180, max: 180 },
    },
    start: { type: DataTypes.DATE, allowNull: true },
    end: { type: DataTypes.DATE, allowNull: true },
    type: DataTypes.STRING,
    free: DataTypes.BOOLEAN,
    ticketLink: DataTypes.STRING,
  }, {
    timestamps: true,
    classMethods: {
      associate: (models) => {
        Event.hasOne(models.ContactInfo);
        Event.hasOne(models.FormContactInfo);
        Event.hasOne(models.Image);
      },
    },
    validate: {
      bothCoordsOrNone: function () {
        if ((this.latitude === null) !== (this.longitude === null)) {
          throw new Error('Require either both latitude and longitude or neither');
        }
      },
    },
  });

  return Event;
};

export default createEvent;
