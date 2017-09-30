"use strict";

module.exports = function(sequelize, DataTypes) {
    var Guestvote = sequelize.define("Guestvote", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }},{
        classMethods: {
            associate: function(models) {
                Guestvote.belongsTo(models.Solution, {
                    foreignKey: {
                        allowNull: false
                    }
                });
                Guestvote.belongsTo(models.Stage, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
    return Guestvote;
};