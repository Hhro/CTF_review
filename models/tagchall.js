module.exports = (sequelize, DataTypes) => (
    sequelize.define('tagchall', {
        tag: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            allowNull: false,
        },
        challId:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        }
    }, {
        timestamps: true,
    })
  );