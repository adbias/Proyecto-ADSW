"use strict";

module.exports = function(sequelize, DataTypes) {
    var Solution = sequelize.define("Solution", {
        description: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Solution.hasMany(models.Voto)
            }
        }
    });

    return Solution;
};
