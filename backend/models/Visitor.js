import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';


export const Visitor = sequelize.define('Visitor', {
    Visitor_ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'Visitor_ID'
  },
  Visitor_UUID: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
    field: 'Visitor_UUID'
  },
  IP_Address: {
    type: DataTypes.STRING(39),
    allowNull: true,
    field: 'IP_Address'
  },
  Is_Returning_Visitor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'Is_Returning_Visitor'
  },
  Time_Visited: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'Time_Visited'
  }
}, {
  tableName: 'Visitor',
  timestamps: false
});


export default Visitor;
