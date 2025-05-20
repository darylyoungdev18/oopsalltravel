import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Visitor } from './Visitor.js';

export const User_Account = sequelize.define('User_Account', {
  User_Account_ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  User_Account_Name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  User_Account_Email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  User_Account_Password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  User_Account_Phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  Visitor_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Visitor,
      key: 'Visitor_ID'
    }
  },
  Visited_At: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'User_Account',
  timestamps: false 
});


export default User_Account;
