"use strict";

module.exports = function(sequelize, DataTypes) {
    var Stage = sequelize.define("Stage", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        }},{
        classMethods: {
            associate: function(models) {
                Stage.belongsTo(models.Sesion, {
                    foreignKey: {
                        allowNull: false
                    }
                });
                Stage.hasMany(models.Msg);
                Stage.hasMany(models.Voto);
            }
        }
    });
    return Stage;
};