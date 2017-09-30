"use strict";

module.exports = function(sequelize, DataTypes) {
    var Guestmsg = sequelize.define("Guestmsg", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            nick: {
                type: DataTypes.STRING,
                allowNull: false
            },
            time: {
                type: DataTypes.STRING,
                allowNull: false
            },
            msg: DataTypes.DATE},
        {
            classMethods: {
                associate: function (models) {
                    Guestmsg.belongsTo(models.Sesion, {
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        });
    return Guestmsg;
};