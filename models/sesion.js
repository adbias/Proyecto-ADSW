"use strict";

module.exports = function(sequelize, DataTypes) {
    var Sesion = sequelize.define("Sesion", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        timer:{
            type: DataTypes.STRING,
            allowNull: false
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        objetivo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false

        }}, {
            classMethods: {
                associate: function(models) {
                    Sesion.belongsTo(models.Usuario, {
                        foreignKey: {
                            allowNull: false
                        }
                    });
                    Sesion.hasMany(models.Stage, {
                        foreignKey: 'SesionId'
                    })
                }
            }
        });
    return Sesion;
};