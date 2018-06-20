import Sequelize from 'sequelize';
import User from './user';
import Post from './post';
import Token from './token';

const sequelize = new Sequelize(process.env.DATABASE_URL);

sequelize
  .authenticate()
  .then(() => console.log('Successfully connected to the database'))
  .catch(err => {
    throw err;
  });

const models = { User, Post, Token };
Object.entries(models).forEach(([name, model]) =>
  sequelize.import(name, model),
);
Object.values(sequelize.models)
  .filter(m => typeof m.associate === 'function')
  .forEach(m => m.associate(sequelize.models));

sequelize.sync();

export default sequelize;
