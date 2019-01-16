module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
      email: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      solves: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      msg: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    }, {
      timestamps: true,
      paranoid: true,
    })
  );
  