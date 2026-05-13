import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/db";

export interface BlogI {
  id?: number;
  name: string;
  creationDate?: Date;
  status: "ACTIVE" | "INACTIVE";
}

export class Blog extends Model implements BlogI {
  public id!: number;
  public name!: string;
  public creationDate!: Date;
  public status!: "ACTIVE" | "INACTIVE";
}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(150),
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
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "creation_date",
      validate: {
        isValidDate(value: Date) {
          if (value && isNaN(new Date(value).getTime())) {
            throw new Error("Creation date must be a valid date");
          }
        },
      },
    },

    status: {
      type: DataTypes.STRING(8),
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
  },
  {
    sequelize,
    modelName: "Blog",
    tableName: "blogs",
    timestamps: false,
  }
);