import Visitor from './Visitor.js';
import User_Account from './User_Account.js';
import Blog from './Blog.js';
import { Written_Blog } from './Written_Blog.js';
import { Video_Blog } from './Video_Blog.js';
import { Blog_Like } from './Blog_Like.js';
import { Blog_View } from './Blog_View.js';
import { Location } from './Location.js';

// Define associations
Visitor.hasMany(User_Account, { foreignKey: 'Visitor_ID' });
User_Account.belongsTo(Visitor, { foreignKey: 'Visitor_ID' });

User_Account.hasMany(Blog, { foreignKey: 'User_Account_ID' });
Blog.belongsTo(User_Account, { foreignKey: 'User_Account_ID' });

User_Account.hasMany(Blog_Like, { foreignKey: 'User_Account_ID' });
Blog_Like.belongsTo(User_Account, { foreignKey: 'User_Account_ID' });

Blog.hasMany(Blog_Like, { foreignKey: 'Blog_ID' });
Blog_Like.belongsTo(Blog, { foreignKey: 'Blog_ID' });

User_Account.hasMany(Blog_View, { foreignKey: 'User_Account_ID' });
Blog_View.belongsTo(User_Account, { foreignKey: 'User_Account_ID' });

Blog.hasMany(Blog_View, { foreignKey: 'Blog_ID' });
Blog_View.belongsTo(Blog, { foreignKey: 'Blog_ID' });


Blog.hasOne(Written_Blog, { foreignKey: 'Blog_ID' });
Blog.hasOne(Video_Blog, { foreignKey: 'Blog_ID' });

Written_Blog.belongsTo(Blog, { foreignKey: 'Blog_ID' });
Video_Blog.belongsTo(Blog, { foreignKey: 'Blog_ID' });

User_Account.belongsToMany(Blog, { through: Blog_Like, foreignKey: 'User_Account_ID' });
Blog.belongsToMany(User_Account, { through: Blog_Like, foreignKey: 'Blog_ID' });

Blog.belongsTo(Location, { foreignKey: 'Location_ID' });
Location.hasMany(Blog, { foreignKey: 'Location_ID' });


export default function initializeAssociations() {

}