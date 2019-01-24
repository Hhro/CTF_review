module.exports = (sequelize, DataTypes) => (
    sequelize.define('chall', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        flag: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        solves: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        timestamps: true,
    })
  );