import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Blog } from './Blog.js';

export const Location = sequelize.define('Location', {
  Location_ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  Is_Featued_Location: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  Location_Place: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
  }
},{
    tableName: 'Location',
    timestamps: false
} );

export default Location;