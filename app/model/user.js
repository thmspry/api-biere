module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },{timestamps: false});
    return User
}

