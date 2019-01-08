module.exports = (sequelize, DataTypes) => (
    sequelize.define('chall', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        flag: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        }
    }, {
        timestamps: true,
    })
  );