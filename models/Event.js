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
    // start: { type: DataTypes.DATE, allowNull: true },
    // end: { type: DataTypes.DATE, allowNull: true },
    type: DataTypes.STRING,
    free: DataTypes.BOOLEAN,
    ticketLink: DataTypes.STRING,
  }, {
    timestamps: true,
    classMethods: {
      associate: (models) => {
        Event.ContactInfo = Event.hasOne(models.ContactInfo, { as: 'contactInfo' });
        Event.FormContactInfo = Event.hasOne(models.FormContactInfo, { as: 'formContactInfo' });
        Event.Image = Event.hasOne(models.Image, { as: 'image' });
        Event.Times = Event.hasMany(models.Time, { as: 'times' });
      },
    },
    // getterMethods: {
    //   singleDateTime: function () {
    //     return this.start === null || this.end === null;
    //   },
    // },
    validate: {
      bothCoordsOrNone() {
        if ((this.latitude === null) !== (this.longitude === null)) {
          throw new Error('Require either both latitude and longitude or neither');
        }
      },
    },
  });

  return Event;
};

module.exports = createEvent;
