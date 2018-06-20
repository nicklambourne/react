export default function createTokenModel(sequelize, DataTypes) {
  const Token = sequelize.define('token', {
    token: DataTypes.STRING,
  });

  Token.associate = function(models) {
    Token.belongsTo(models.user);
  };

  return Token;
}
