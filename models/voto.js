"use strict";

module.exports = function(sequelize, DataTypes) {
    var Voto = sequelize.define("Voto", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false
        }},{
        classMethods: {
            associate: function (models) {
                Voto.belongsTo(models.Stage, {
                    foreignKey: {
                        allowNull: false
                    }
                });
                Voto.belongsTo(models.Solution, {
                    foreignKey: {
                        allowNull: false
                    }
                });
                Voto.belongsTo(models.Usuario, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
    return Voto;
};