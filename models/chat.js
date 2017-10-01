"use strict";

module.exports = function(sequelize, DataTypes) {
    var Chat = sequelize.define("Chat", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false

        },
        msg: DataTypes.STRING,
        sessionid: DataTypes.INTEGER
    });
    return Chat;
};