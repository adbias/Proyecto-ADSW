"use strict";

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Chat", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        msg: {
            type:DataTypes.STRING,
            allowNull: false
        },
        sessionid: DataTypes.INTEGER
    });
};