const { forwardTo } = require('prisma-binding');
const calculateAccomplishment = require('../../utils/calculateAccomplishment');

const deleteLearnSet = forwardTo('prisma');

const createLearnSet = async (_parent, { where }, context, info) => {
  const userid = context.request.userid;
  if (!userid) {
    throw new Error('You have to be logged in to do that');
  }

  const exists = await context.prisma.exists.LearnSet({
    set: {
      id: where.id
    }
  });
  if (exists) {
    throw new Error(`You're already studying this set`);
  }

  const set = await context.prisma.query.set(
    { where: { id: where.id } },
    `{
      id
      title
      terms {
        id
        spanish
        english
      }
    }`
  );

  const learnTerms = set.terms.map(term => ({
    spanish: term.spanish,
    english: term.english,
    ratio: 0,
    term: {
      connect: {
        id: term.id
      }
    }
  }));

  const learnSet = await context.prisma.mutation.createLearnSet(
    {
      data: {
        title: set.title,
        amount: set.terms.length,
        set: {
          connect: {
            id: set.id
          }
        },
        author: {
          connect: {
            id: userid
          }
        },
        learnTerms: {
          create: learnTerms
        }
      }
    },
    info
  );

  return learnSet;
};

const updateLearnTerm = async (_parent, { where, data }, context, info) => {
  const learnTerm = await context.prisma.query.learnTerm(
    {
      where: {
        id: where.id
      }
    },
    `{
      id
      ratio
      learnSet {
        id
        amount
      }
    }`
  );

  const otherLearnTerms = await context.prisma.query.learnTerms(
    {
      where: {
        id_not: learnTerm.id,
        learnSet: {
          id: learnTerm.learnSet.id
        }
      }
    },
    `{ ratio }`
  );

  const ratioSum = otherLearnTerms.reduce((sum, { ratio }) => sum + ratio, 0);
  const { ratio, knowledge, mastered } = calculateAccomplishment(
    data,
    learnTerm.ratio,
    ratioSum,
    learnTerm.learnSet.amount
  );

  const updatedLearnTerm = await context.prisma.mutation.updateLearnTerm(
    {
      data: {
        mastered,
        ratio,
        learnSet: {
          update: {
            knowledge
          }
        }
      },
      where: {
        id: where.id
      }
    },
    info
  );

  return updatedLearnTerm;
};

module.exports = {
  createLearnSet,
  deleteLearnSet,
  updateLearnTerm
};
