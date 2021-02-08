const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (root, args, context, info) => {
  args.email = args.email.toLowerCase();
  // TODO: validate email

  const hashedPass = await bcrypt.hash(args.password, 10);
  const { password, ...user } = await context.prisma.mutation.createUser({
    data: {
      ...args,
      password: hashedPass
    },
    info
  });
  const token = jwt.sign(
    { userId: user.id },
    process.env.APP_SECRET
  );

  context.response.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365
  });

  return user;
};

const signin = async (root, { email, password }, context) => {
  const user = await context.prisma.query.user({ where: { email } });
  if (!user) {
    throw new Error(`No such user found for email ${email}`);
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error(`Invalid password `)
  }
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
  context.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365
  })
  return user;
};

const signout = (root, args, context) => {
  context.response.clearCookie('token');
  return { message: 'logged out' }
};

module.exports = {
  signup,
  signin,
  signout
};
