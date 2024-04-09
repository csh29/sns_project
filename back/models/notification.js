const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Notification extends Model {
  static init(sequelize) {
    return super.init({
      reception: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      senderId: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      targetId: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
    }, {
      modelName: 'Notification',
      tableName: 'notifications',
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize,
    });
  }
  static associate(db) {
    db.Notification.belongsTo(db.User);
  }
};
