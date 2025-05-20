import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Blog } from './Blog.js';

export const Video_Blog = sequelize.define('Video_Blog', {
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
  tableName: 'Video_Blog',
  timestamps: false 
}
);


Video_Blog.belongsTo(Blog, { foreignKey: 'Blog_ID' });


export default Video_Blog;