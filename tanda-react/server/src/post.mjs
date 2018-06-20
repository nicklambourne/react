import k from 'koa-route';
import Sequelize from 'sequelize';
import db from './database';

const Op = Sequelize.Op;

async function get(ctx) {
  const { page = 1 } = ctx.request.query;
  const offset = (page - 1) * 25;
  const limit = page * 25;
  const { count, rows } = await db.models.post.scope('root').findAndCount({
    offset,
    limit,
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
  });
  const items = await Promise.all(rows.map(row => row.display()));
  ctx.body = {
    items,
    page,
    count,
    next: count > limit,
  };
}

async function find(ctx, id) {
  const post = await db.models.post.findById(id);
  if (!post) {
    return ctx.throw(404);
  }

  const replies = await post
    .getReplies()
    .then(r => Promise.all(r.map(p => p.display())));

  ctx.body = {
    ...post.toJSON(),
    replies,
  };
}

async function update(ctx, id) {
  const post = await db.models.post.findById(id);
  if (!post) {
    return ctx.throw(404);
  }

  const { body } = ctx.request;
  const update = {};
  if ('body' in body) {
    update.body = body.body;
  }
  if ('title' in body) {
    update.title = body.title;
  }

  const updated = await post.update(update);
  ctx.body = await updated.display();
}

async function create(ctx) {
  try {
    const post = await db.models.post.create(ctx.request.body);
    await post.setUser(ctx.user);
    ctx.body = post.toJSON();
    ctx.status = 201;
  } catch (e) {
    if (Array.isArray(e.errors)) {
      const errors = e.errors.map(error => error.message);
      return ctx.throw(400, errors.join(', '));
    }

    throw e;
  }
}

async function del(ctx, id) {
  const post = await db.models.post.findById(id);
  if (!post) {
    return ctx.throw(404, "That post doesn't exist");
  }
  if (post.userId !== ctx.user.id) {
    return ctx.throw(401, 'You can only delete your own posts');
  }

  await post.setUser(null);

  ctx.body = null;
  ctx.status = 204;
}

export default function post(app) {
  app.use(k.get('/posts', get));
  app.use(k.get('/posts/:id', find));
  app.use(k.put('/posts/:id', update));
  app.use(k.post('/posts', create));
  app.use(k.delete('/posts/:id', del));
}
