import Sequelize from 'sequelize';

const { Op } = Sequelize;

export default function createPostModel(sequelize, DataTypes) {
  const Post = sequelize.define('post', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
  }, {
    scopes: {
      root: {
        where: {
          parentId: null,
        },
      },
      reply: {
        where: {
          parentId: {
            [Op.ne]: null,
          },
        },
      },
    },
  });

  Post.associate = function(models) {
    Post.belongsTo(models.user);
    Post.hasMany(models.post, { as: 'replies', foreignKey: 'parentId' });
  };

  Post.prototype.display = async function display() {
    const replyCount = await this.countReplies();
    return {
      ...this.toJSON(),
      replyCount,
    };
  };

  return Post;
}
