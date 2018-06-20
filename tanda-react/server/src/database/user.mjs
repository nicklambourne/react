export default function createUserModel(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
  });

  User.associate = function(models) {
    User.hasMany(models.token);
    User.hasMany(models.post);
  };

  User.prototype.display = async function display() {
    const posts = await this.getPosts({ scope: ['root'] });
    const replies = await this.getPosts({ scope: ['reply'] });
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      replies,
      posts,
    };
  }

  return User;
}
