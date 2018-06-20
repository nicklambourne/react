import crypto from 'crypto';
import k from 'koa-route';
import bcrypt from 'bcrypt';
import db from './database';

const SALT_ROUNDS = 12;
const SECRET = process.env.TOKEN_SECRET;

function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function comparePassword(hashed, string) {
  return bcrypt.compare(string, hashed);
}

async function getAll(ctx) {
  const users = await db.models.user.findAll();
  ctx.body = await Promise.all(users.map(user => user.display()));
}

async function get(ctx, id) {
  const user = await db.models.user.findById(id);
  if (!user) {
    return ctx.throw(404);
  }

  ctx.body = await user.display();
}

async function update(ctx, id) {}

async function create(ctx) {
  const raw = ctx.request.body;

  const password = await hashPassword(raw.password);

  try {
    const user = await db.models.user.create({
      ...raw,
      password,
    });
    ctx.body = await user.display();
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      const errors = e.errors.map(error => error.message);
      return ctx.throw(400, errors.join(', '));
    }
    throw e;
  }
}

async function login(ctx) {
  console.log(SECRET);
  const { email, password } = ctx.request.body;
  const user = await db.models.user.findOne({ where: { email } });
  if (!user) {
    // this should probably do some extra work so that people externally
    // can't tell if the password is wrong or the email doesn't exist

    return ctx.throw(404, { error: 'User not found' });
  }

  const match = comparePassword(user.password, password);

  if (!match) {
    return ctx.throw(401, { error: 'Wrong password' });
  }

  // definitely not *the most* secure, but it will do for now
  const token = crypto
    .createHmac('sha256', SECRET)
    .update(user.id.toString())
    .update(`${Date.now()}`)
    .digest('hex');
  const t = await db.models.token.create({ token, userId: user.id });
  t.setUser(user);

  ctx.body = {
    ...(await user.display()),
    token,
  };
}

export default function user(app) {
  app.use(k.get('/users', getAll));
  app.use(k.get('/users/:id', get));
  app.use(k.post('/users', create));
  app.use(k.put('/users/:id', update));

  app.use(k.post('/login', login));
}
