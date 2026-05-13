"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../database/db");
class Blog extends sequelize_1.Model {
}
exports.Blog = Blog;
Blog.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Blog name is required",
            },
            notEmpty: {
                msg: "Blog name cannot be empty",
            },
            len: {
                args: [3, 150],
                msg: "Blog name must be between 3 and 150 characters",
            },
        },
    },
    creationDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "creation_date",
        validate: {
            isValidDate(value) {
                if (value && isNaN(new Date(value).getTime())) {
                    throw new Error("Creation date must be a valid date");
                }
            },
        },
    },
    status: {
        type: sequelize_1.DataTypes.STRING(8),
        allowNull: false,
        defaultValue: "ACTIVE",
        validate: {
            notNull: {
                msg: "Status is required",
            },
            notEmpty: {
                msg: "Status cannot be empty",
            },
            isIn: {
                args: [["ACTIVE", "INACTIVE"]],
                msg: "Status must be ACTIVE or INACTIVE",
            },
        },
    },
}, {
    sequelize: db_1.sequelize,
    modelName: "Blog",
    tableName: "blogs",
    timestamps: false,
});
