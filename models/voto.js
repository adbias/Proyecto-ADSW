"use strict";

module.exports = function(sequelize, DataTypes) {
    var Voto = sequelize.define("Msg", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        classMethods: {
            associate: function (models) {
                Voto.belongsTo(models.Sesion, {
                    foreignKey: {
                        allowNull: false
                    }
                )},
                Voto.belongsTo(models.Solution, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
    return Voto;
};