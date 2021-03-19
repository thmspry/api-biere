module.exports = (sequelize, DataTypes) => {
    const Beer = sequelize.define("beers", {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{timestamps: false});
    return Beer
}

