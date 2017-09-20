"use strict";

module.exports = function(sequelize, DataTypes) {
    var Usuario = sequelize.define("Usuario", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }}, { classMethods: {
            associate: function(models) {
                Usuario.hasMany(models.Sesion)
            }
        }
    });
    return Usuario;
};