const { MINRATIO, MAXRATIO } = require('./variables');

function calculateAccomplishment(update, prevRatio, ratioSum, amount) {
  let updateRatio = 0;
  switch (update) {
    case 'INCREMENT':
      updateRatio = 1;
      break;
    case 'DECREMENT':
      updateRatio = -1;
      break;
    case 'STATIC':
      updateRatio = 0;
      break;
    default:
      updateRatio = 0;
      break;
  }
  let ratio = prevRatio + updateRatio;
  const mastered = ratio === 6 ? true : false;
  ratio = Math.min(Math.max(ratio, MINRATIO), MAXRATIO);
  const newRatioSum = ratioSum + ratio;
  const knowledge = Math.round((newRatioSum / (amount * MAXRATIO)) * 100);

  return {
    ratio,
    knowledge,
    mastered
  };
}

module.exports = calculateAccomplishment;
