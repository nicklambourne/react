import axios from 'axios';
import faker from 'faker';

// axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.baseURL = 'http://52.63.49.248';

const users = [
  {
    name: 'David Buchan-Swanson',
    email: 'david@tanda.co',
    password: 'testpassword',
  },
];
for (let i = 0; i < 15; i++) {
  users.push({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  });
}

const randomizer = {
  user() {
    return Math.floor(Math.random() * users.length);
  },
  para() {
    const m = Math.random();
    return m > 0.66 ? 'paragraphs' : m > 0.33 ? 'paragraph' : 'lines';
  },
  index(length, offset = 0) {
    return offset + Math.floor(Math.random() * length);
  },
};

const posts = [];
for (let i = 0; i < 150; i++) {
  posts.push({
    title: faker.lorem.words(),
    body: faker.lorem[randomizer.para()](), // randomly call `paragraph`, `paragraphs`, `lines`
  });
}

let first_replies = [];
for (let i = 0; i < 150; i++) {
  first_replies.push({
    title: faker.lorem.words(),
    body: faker.lorem[randomizer.para()](), // randomly call `paragraph`, `paragraphs`, `lines`
    parentId: 1 + randomizer.index(150), // parent is one of the first comments
  });
}

let second_replies = [];
for (let i = 0; i < 150; i++) {
  second_replies.push({
    title: faker.lorem.words(),
    body: faker.lorem[randomizer.para()](), // randomly call `paragraph`, `paragraphs`, `lines`
    parentId: 1 + randomizer.index(150, 150), // parent is one of the first comments
  });
}

let third_replies = [];
for (let i = 0; i < 150; i++) {
  third_replies.push({
    title: faker.lorem.words(),
    body: faker.lorem[randomizer.para()](), // randomly call `paragraph`, `paragraphs`, `lines`
    parentId: 1 + randomizer.index(150, 300), // parent is one of the first comments
  });
}

async function run() {
  // create our main user
  await Promise.all(users.map(u => axios.post('/users', u)));
  // log in every user
  const tokens = (await Promise.all(
    users.map(({ name, ...login }) => axios.post('/login', login)),
  )).map(({ data }) => data.token);

  let comments = []
    .concat(posts, first_replies, second_replies, third_replies)
    .reduce((p, comment) => {
      const random = randomizer.user();
      const token = tokens[random];
      return p.then(() =>
        axios.post('/posts', comment, {
          headers: { Authorization: `bearer ${tokens[randomizer.user()]}` },
        }),
      );
    }, Promise.resolve());
}

run();
