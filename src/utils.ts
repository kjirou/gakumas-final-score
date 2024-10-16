export const difficulties = [
  {
    kind: "master",
    label: "マスター",
    maxIdolParameter: 1800,
  },
  {
    kind: "pro",
    label: "プロ",
    maxIdolParameter: 1500,
  },
  {
    kind: "regular",
    label: "レギュラー",
    maxIdolParameter: 1000,
  },
] as const;

export type Difficulty = (typeof difficulties)[number];

export const finalExamRanks = {
  "1": {
    rating: 1700,
    idolParameterIncrease: 30,
  },
  "2": {
    rating: 900,
    idolParameterIncrease: 20,
  },
  "3": {
    rating: 500,
    idolParameterIncrease: 10,
  },
} as const;

export type FinalExamRank = keyof typeof finalExamRanks;

export type IdolParameters = {
  vocal: number;
  dance: number;
  visual: number;
};

const addIdolParameter = (maxIdolParameter: number, a: number, b: number) =>
  Math.min(a + b, maxIdolParameter);

const IdolRanks = [
  {
    name: "SS",
    necessaryRating: 16000,
  },
  {
    name: "S+",
    necessaryRating: 14500,
  },
  {
    name: "S",
    necessaryRating: 13000,
  },
  {
    name: "A+",
    necessaryRating: 11500,
  },
  {
    name: "A",
    necessaryRating: 10000,
  },
  {
    name: "B+",
    necessaryRating: 8000,
  },
  {
    name: "B",
    necessaryRating: 6000,
  },
  {
    name: "C+",
    necessaryRating: 4500,
  },
  {
    name: "C",
    necessaryRating: 3000,
  },
  {
    name: "D",
    necessaryRating: 0,
  },
];

type IdolRank = (typeof IdolRanks)[number];

/**
 * 最終試験のスコアに対する評価点の割合
 *
 * - rate はパーセンテージで表現している、JSだと小数を掛けると計算が正確にできない可能性があるため
 */
const finalExamScoreRates = [
  {
    upperBound: 5000,
    rate: 30,
  },
  {
    upperBound: 10000,
    rate: 15,
  },
  {
    upperBound: 20000,
    rate: 8,
  },
  {
    upperBound: 30000,
    rate: 4,
  },
  {
    upperBound: 40000,
    rate: 2,
  },
  {
    // ダミー値として、絶対到達できないような最終試験スコアの値を設定している
    upperBound: 100000000,
    rate: 1,
  },
] as const;

export const calculateNecessaryFinalExamScoreForSpecificRating = (
  rating: IdolRank["necessaryRating"],
): number => {
  let restRating = rating;
  for (const [index, finalExamScoreRate] of finalExamScoreRates.entries()) {
    const beforeUpperBound =
      index === 0 ? 0 : finalExamScoreRates[index - 1].upperBound;
    const maxRatingInThisRange =
      ((finalExamScoreRate.upperBound - beforeUpperBound) *
        finalExamScoreRate.rate) /
      100;
    if (restRating > maxRatingInThisRange) {
      restRating -= maxRatingInThisRange;
    } else {
      return (
        Math.ceil((restRating / finalExamScoreRate.rate) * 100) +
        beforeUpperBound
      );
    }
  }
  throw new Error("`rating` is out of range.");
};

export const calculateNecessaryFinalExamScores = (
  difficulty: Difficulty,
  finalExamRank: FinalExamRank,
  idolParameters: IdolParameters,
  logHandler: (message: string) => void,
): Array<{
  name: IdolRank["name"];
  necessaryScore: number;
}> => {
  const finalExamRankData = finalExamRanks[finalExamRank];
  logHandler(`最終試験前の順位によるスコア: ${finalExamRankData.rating}`);
  logHandler(`最終試験前のパラメータ: ${JSON.stringify(idolParameters)}`);
  const idolParametersAfterFinalExam: IdolParameters = {
    vocal: addIdolParameter(
      difficulty.maxIdolParameter,
      idolParameters.vocal,
      finalExamRankData.idolParameterIncrease,
    ),
    dance: addIdolParameter(
      difficulty.maxIdolParameter,
      idolParameters.dance,
      finalExamRankData.idolParameterIncrease,
    ),
    visual: addIdolParameter(
      difficulty.maxIdolParameter,
      idolParameters.visual,
      finalExamRankData.idolParameterIncrease,
    ),
  };
  logHandler(
    `最終試験の上昇分を含むパラメータ: ${JSON.stringify(idolParametersAfterFinalExam)}`,
  );
  const idolParameterSum = Object.values(idolParametersAfterFinalExam).reduce(
    (acc, e) => acc + e,
    0,
  );
  logHandler(`最終試験の上昇分を含むパラメータ合計値: ${idolParameterSum}`);
  const idolParameterRating = Math.floor((idolParameterSum * 23) / 10);
  logHandler(`パラメータの評価点: ${idolParameterRating}`);
  const fixedRating = finalExamRankData.rating + idolParameterRating;
  return IdolRanks.map((idolRank) => {
    return {
      name: idolRank.name,
      necessaryScore: calculateNecessaryFinalExamScoreForSpecificRating(
        Math.max(idolRank.necessaryRating - fixedRating, 0),
      ),
    };
  });
};

export const formatIntegerStringWithCommas = (integerString: string) => {
  return integerString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
