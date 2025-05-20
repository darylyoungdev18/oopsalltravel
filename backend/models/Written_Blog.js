import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Blog } from './Blog.js';

export const Written_Blog = sequelize.define('Written_Blog', {
    Blog_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Blog,
        key: 'id'
      }
    },
},
{
  tableName: 'Written_Blog',
  timestamps: false 
}
);

Written_Blog.belongsTo(Blog, { foreignKey: 'Blog_ID' });

export default Written_Blog;