import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User_Account } from './User_Account.js';
import { Blog } from './Blog.js';

export const Blog_Like = sequelize.define('Blog_Like', {
    Blog_Like_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    User_Account_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User_Account,
            key: 'User_Account_ID'
        }
    },
    Blog_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Blog,
            key: 'Blog_ID'
        }
    },
    Liked_At: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
}, {
    tableName: 'Blog_Like',
    timestamps: false
});

User_Account.belongsToMany(Blog, { through: Blog_Like, foreignKey: 'User_Account_ID' });
Blog.belongsToMany(User_Account, { through: Blog_Like, foreignKey: 'Blog_ID' });


export default Blog_Like;