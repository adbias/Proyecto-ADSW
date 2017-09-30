"use strict";

module.exports = function(sequelize, DataTypes) {
    var Msg = sequelize.define("Msg", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            time: {
                type: DataTypes.STRING,
                allowNull: false
            },
            msg: DataTypes.DATE},
        {
            classMethods: {
                associate: function (models) {
                    Msg.belongsTo(models.Sesion, {
                        foreignKey: {
                            allowNull: false
                        }
                    });
                    Msg.belongsTo(models.Usuario, {
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        });
    return Msg;
};