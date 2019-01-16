module.exports = (sequelize, DataTypes) => (
    sequelize.define('UserChall', {
        firstsolve: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
    }, {
        timestamps: true,
    })
  );