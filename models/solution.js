"use strict";

module.exports = function(sequelize, DataTypes) {
    var Solution = sequelize.define("Solution", {
        mechanism: DataTypes.STRING,
        result: DataTypes.STRING,
        name: {
            type: DataTypes.STRING,
            allowNull: false

        },
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    }, {timestamps:false,
        classMethods: {
            associate: function(models) {
                Solution.hasMany(models.Voto);
            }
        }
    });
    return Solution;
};
