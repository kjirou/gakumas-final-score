import {
  calculateNecessaryFinalExamScoreForSpecificRating,
  calculateNecessaryFinalExamScores,
  formatIntegerStringWithCommas,
} from "./utils";

describe("calculateNecessaryFinalExamScoreForSpecificRating", () => {
  const testCases: Array<{
    args: Parameters<typeof calculateNecessaryFinalExamScoreForSpecificRating>;
    expected: ReturnType<
      typeof calculateNecessaryFinalExamScoreForSpecificRating
    >;
  }> = [
    {
      args: [0],
      expected: 0,
    },
    {
      args: [1],
      expected: 4,
    },
    {
      args: [1500],
      expected: 5000,
    },
    {
      args: [1501],
      expected: 5007,
    },
    {
      args: [2250],
      expected: 10000,
    },
    {
      args: [2251],
      expected: 10013,
    },
    {
      args: [3050],
      expected: 20000,
    },
    {
      args: [3051],
      expected: 20025,
    },
    {
      args: [3450],
      expected: 30000,
    },
    {
      args: [3451],
      expected: 30050,
    },
    {
      args: [3650],
      expected: 40000,
    },
    {
      args: [3651],
      expected: 40100,
    },
    {
      args: [4650],
      expected: 140000,
    },
  ];
  test.each(testCases)("$args -> $expected", ({ args, expected }) => {
    expect(calculateNecessaryFinalExamScoreForSpecificRating(...args)).toBe(
      expected,
    );
  });
});

describe("calculateNecessaryFinalExamScores", () => {
  test("all 1500 parameters results as the same result as all 1470 parameters", () => {
    const result1500 = calculateNecessaryFinalExamScores(
      "1",
      { vocal: 1500, dance: 1500, visual: 1500 },
      () => {},
    );
    const result1470 = calculateNecessaryFinalExamScores(
      "1",
      { vocal: 1470, dance: 1470, visual: 1470 },
      () => {},
    );
    expect(result1500).toStrictEqual(result1470);
  });
  describe("compares with real-world results", () => {
    const testCases: Array<{
      args: Parameters<typeof calculateNecessaryFinalExamScores>;
      expected: ReturnType<typeof calculateNecessaryFinalExamScores>;
    }> = [
      // Source: "学マス評価値計算機"<https://docs.google.com/spreadsheets/d/1eEdzfHGi7iXpohR-UHr5-W1z7PcYBqQr8OAV7gcvhR8/edit#gid=0>
      {
        args: ["1", { vocal: 1000, dance: 1000, visual: 1000 }, () => {}],
        expected: [
          expect.any(Object),
          { name: "S", necessaryScore: 94300 },
          { name: "A+", necessaryScore: 15538 },
          { name: "A", necessaryScore: 3977 },
          { name: "B+", necessaryScore: 0 },
          { name: "B", necessaryScore: 0 },
          { name: "C+", necessaryScore: 0 },
          { name: "C", necessaryScore: 0 },
          { name: "D", necessaryScore: 0 },
        ],
      },
      // Source: "学マス評価値計算機"<https://docs.google.com/spreadsheets/d/1eEdzfHGi7iXpohR-UHr5-W1z7PcYBqQr8OAV7gcvhR8/edit#gid=0>
      {
        args: ["1", { vocal: 70, dance: 70, visual: 70 }, () => {}],
        expected: [
          expect.any(Object),
          { name: "S", necessaryScore: 736000 },
          { name: "A+", necessaryScore: 586000 },
          { name: "A", necessaryScore: 436000 },
          { name: "B+", necessaryScore: 236000 },
          { name: "B", necessaryScore: 38000 },
          { name: "C+", necessaryScore: 9067 },
          { name: "C", necessaryScore: 2034 },
          { name: "D", necessaryScore: 0 },
        ],
      },
      // Source: "学マス評価値計算機"<https://docs.google.com/spreadsheets/d/1eEdzfHGi7iXpohR-UHr5-W1z7PcYBqQr8OAV7gcvhR8/edit#gid=0>
      {
        args: ["1", { vocal: 1470, dance: 1470, visual: 1470 }, () => {}],
        expected: [
          expect.any(Object),
          { name: "S", necessaryScore: 3167 },
          { name: "A+", necessaryScore: 0 },
          { name: "A", necessaryScore: 0 },
          { name: "B+", necessaryScore: 0 },
          { name: "B", necessaryScore: 0 },
          { name: "C+", necessaryScore: 0 },
          { name: "C", necessaryScore: 0 },
          { name: "D", necessaryScore: 0 },
        ],
      },
      // Source: "学マスS+取得者の構成から見る「基本の大切さ」"<https://note.com/danbobo/n/n5713c3b5cc1a>
      {
        args: ["1", { vocal: 899, dance: 1454, visual: 1470 }, () => {}],
        expected: [
          { name: "S+", necessaryScore: 55100 },
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
        ],
      },
    ];
    test.each(testCases)(
      "$args.1 -> $expected.0/$expected.1/$expected.2",
      ({ args, expected }) => {
        expect(calculateNecessaryFinalExamScores(...args)).toStrictEqual(
          expected,
        );
      },
    );
  });
});

describe("formatIntegerStringWithCommas", () => {
  const testCases: Array<{
    args: Parameters<typeof formatIntegerStringWithCommas>;
    expected: ReturnType<typeof formatIntegerStringWithCommas>;
  }> = [
    {
      args: ["0"],
      expected: "0",
    },
    {
      args: ["1"],
      expected: "1",
    },
    {
      args: ["10"],
      expected: "10",
    },
    {
      args: ["100"],
      expected: "100",
    },
    {
      args: ["1000"],
      expected: "1,000",
    },
    {
      args: ["1001"],
      expected: "1,001",
    },
    {
      args: ["10000"],
      expected: "10,000",
    },
    {
      args: ["1000000"],
      expected: "1,000,000",
    },
    {
      args: ["1000000000"],
      expected: "1,000,000,000",
    },
    {
      args: ["-0"],
      expected: "-0",
    },
    {
      args: ["-10"],
      expected: "-10",
    },
    {
      args: ["-1000"],
      expected: "-1,000",
    },
    {
      args: ["-10000"],
      expected: "-10,000",
    },
    {
      args: ["-1000000"],
      expected: "-1,000,000",
    },
  ];
  test.each(testCases)("$args -> $expected", ({ args, expected }) => {
    expect(formatIntegerStringWithCommas(...args)).toBe(expected);
  });
});
