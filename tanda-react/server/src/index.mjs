import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import kors from '@koa/cors';
import k from 'koa-route';
import db from './database';
import userRouteAttacher from './user';
import postRouteAttacher from './post';

const TOKEN_REGEX = /[Bb]earer (.*)/;
const app = new Koa();

app.use(logger());
app.use(bodyParser());
app.use(kors());

app.use(async (ctx, next) => {
  const authHeader = ctx.headers.authorization;
  if (!authHeader) {
    if (ctx.method === 'GET') {
      return ctx.throw(401);
    }
    if (ctx.path !== '/users' && ctx.path !== '/login') {
      return ctx.throw(401);
    }
    return next();
  }
  const re = authHeader.match(TOKEN_REGEX);
  if (!re) {
    return ctx.throw(401);
  }
  const [, token] = re;
  // try and get the user out if we have a token
  const dbToken = await db.models.token.findOne({ where: { token } });
  if (!dbToken) {
    return ctx.throw(401);
  }

  const user = await dbToken.getUser();
  ctx.user = user;

  return next();
});

userRouteAttacher(app);
postRouteAttacher(app);

app.listen(process.env.APP_PORT);
