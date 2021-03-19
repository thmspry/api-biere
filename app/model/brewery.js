module.exports = (sequelize, DataTypes) => {
    const Brewery = sequelize.define("breweries", {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        nameBreweries: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{timestamps: false});
    return Brewery;
}