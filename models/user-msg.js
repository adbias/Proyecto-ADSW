"use strict";

module.exports = function(sequelize, DataTypes) {
    var Msg = sequelize.define("Msg", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        msg: {
            type: DataTypes
        },
        classMethods: {
            associate: function (models) {
                Msg.belongsTo(models.Sesion, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
    return Msg;
};