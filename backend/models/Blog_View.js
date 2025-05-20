import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Visitor } from './Visitor.js';
import { User_Account } from './User_Account.js';
import { Blog } from './Blog.js';

export const Blog_View = sequelize.define('Blog_View', {
    Blog_View_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Visitor_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Visitor,
            key: 'Visitor_ID'
        }
    },
    User_Account_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
    viewed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Blog_View',
    timestamps: false,
    validate: {
        checkViewer() {
            if ((this.Visitor_ID !== null && this.User_Account_ID !== null) || 
                (this.Visitor_ID === null && this.User_Account_ID === null)) {
                throw new Error('Either Visitor_ID or User_Account_ID must be set, but not both.');
            }
        }
    }
});

export default Blog_View;