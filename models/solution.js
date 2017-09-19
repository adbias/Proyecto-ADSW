"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var Solution = sequelize.define("Rol", {
        description: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Solution.hasmany(models.Voto)
            }
        }
    });

    return Solution;
};
