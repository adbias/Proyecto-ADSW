"use strict";

module.exports = function(sequelize, DataTypes) {
    var Participants = sequelize.define("Participants", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }},{
        classMethods: {
            associate: function (models) {
                Participants.belongsTo(models.Sesion, {
                    foreignKey: {
                        allowNull: false
                    }
                });
                Participants.belongsTo(models.Usuario, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
    return Participants;
};