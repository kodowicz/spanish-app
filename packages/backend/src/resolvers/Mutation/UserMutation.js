const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MINTERMS } = require('../../utils/variables');

const signup = async (_parent, { data }, context, info) => {
  data.email = data.email.toLowerCase();
  // TODO: validate email

  const hashedPass = await bcrypt.hash(data.password, 10);

  const draftTerms = Array(MINTERMS).fill({
    spanish: '',
    english: ''
  });

  const { password, ...user } = await context.prisma.mutation.createUser({
    data: {
      ...data,
      password: hashedPass,
      draftSet: {
        create: {
          draftTerms: {
            create: draftTerms
          }
        }
      }
    },
    info
  });
  const token = jwt.sign({ userid: user.id }, process.env.APP_SECRET);

  context.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365
  });

  return user;
};

const signin = async (_parent, { data }, context) => {
  const { email, password } = data;
  const user = await context.prisma.query.user({ where: { email } });
  if (!user) {
    throw new Error(`No such user found for email ${email}`);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error(`Invalid password`);
  }

  const token = jwt.sign({ userid: user.id }, process.env.APP_SECRET);
  context.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365
  });
  return user;
};

const signout = (_parent, _args, context) => {
  context.response.clearCookie('token');
  return { message: 'logged out' };
};

const updatePassword = async (_parent, { data }, context, info) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error(`You must be logged in to do that`);
  }
  if (data.password !== data.confirmPassword) {
    throw new Error(`Passwords don't match`);
  }

  const user = await context.prisma.query.user(
    { where: { id: userid } },
    `{ password }`
  );
  const valid = await bcrypt.compare(data.password, user.password);
  if (valid) {
    throw new Error(`You can't use the same password`);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const updatedUser = await context.prisma.mutation.updateUser({
    where: { id: userid },
    data: {
      password: hashedPassword
    }
  });

  return {
    message: 'Password updated'
  };
};

module.exports = {
  signup,
  signin,
  signout,
  updatePassword
};
