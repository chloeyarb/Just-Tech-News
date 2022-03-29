const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// Create our User model
class User extends Model {}

// Define table columns and configuration
User.init(
    {
        // TABLE COLUMN DEFINITION GO HERE
        // Define an id column
        id: {
            // use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's NOT NULL option
            allowNull: false,
            // instruct that this is the Primary Key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        // Define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // There cannot be any duplicate email values in table
            unique: true,
            // If allowNull is set to false, we can run our data through validators before ceating table data
            validate: {
                isEmail: true
            }
        },
        // Define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // Password must be at least 4 characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            // Set up beforeCreate lifecycle 'hook' functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // set up beforeUpdate lifecycle 'hook' functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

        // Pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // Don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // Don't pluralize name of database table
        freezeTableName: true,
        // Use underscores instean of camel-casing
        underscored: true,
        // Make it so our model name stays lowercase
        modelName: 'user'
    }
);

module.exports = User;