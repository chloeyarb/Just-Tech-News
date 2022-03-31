const User = require('./User');
const Post = require('./Post');

// Create associations
// User can have many posts
User.hasMany(Post, {
    foreignKey: 'user_id',
});
// Post belongs to one user
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = { User,Post };


// Import the User model and exporting an object with it as a property