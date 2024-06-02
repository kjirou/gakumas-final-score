import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";

type FinalExamRank = "1" | "2" | "3";

const siteTitle = "学マス最終試験スコア逆算ツール";

const pageStyles = {
  margin: "0 auto",
  fontSize: "1em",
  width: 360,
} as const;

const h1Styles = {
  fontSize: "1.25em",
  textAlign: "center",
} as const;

const h2Styles = {
  fontSize: "1em",
  textAlign: "center",
} as const;

const userInputsTableStyles = {
  width: "100%",
} as const;

const parameterValueInput = {
  textAlign: "right",
} as const;

const arrowDownStyle = {
  padding: "0.5em",
  fontSize: "1em",
  textAlign: "center",
} as const;

const necessaryFinalExamScoresTableStyles = {
  margin: "0 auto",
  width: "40%",
} as const;

const necessaryFinalExamScoresTableRankTdStyles = {
  textAlign: "center",
  fontWeight: "bold",
} as const;

const necessaryFinalExamScoresTableScoreTdStyles = {
  textAlign: "right",
} as const;

const useFinalExamCalculation = () => {
  return {
    necessaryFinalExamScores: [
      {
        rank: "S",
        score: 30000,
      },
      {
        rank: "A+",
        score: 15000,
      },
      {
        rank: "A",
        score: 5000,
      },
      {
        rank: "B+",
        score: 1000,
      },
      {
        rank: "B",
        score: 0,
      },
      {
        rank: "C",
        score: 0,
      },
      {
        rank: "C+",
        score: 0,
      },
      {
        rank: "D",
        score: 0,
      },
    ],
  };
};

const IndexPage: React.FC<PageProps> = () => {
  const [finalExamRank, setFinalExamRank] = React.useState<FinalExamRank>("1");
  const onChangeFinalExamRank = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      // TODO: Type guard
      setFinalExamRank(event.currentTarget.value as FinalExamRank);
    },
    [],
  );
  const [vocalValue, setVocalValue] = React.useState(0);
  const [danceValue, setDanceValue] = React.useState(0);
  const [visualValue, setVisualValue] = React.useState(0);
  const onChangeVocalValue = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setVocalValue(parseInt(event.currentTarget.value));
    },
    [],
  );
  const onChangeDanceValue = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDanceValue(parseInt(event.currentTarget.value));
    },
    [],
  );
  const onChangeVisualValue = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setVisualValue(parseInt(event.currentTarget.value));
    },
    [],
  );
  const idolParameterInputs = React.useMemo(
    () => [
      {
        name: "試験前のボーカル(Vo)",
        htmlId: "parameterInputVocal",
        value: vocalValue,
        onChange: onChangeVocalValue,
      },
      {
        name: "試験前のダンス(Da)",
        htmlId: "parameterInputDance",
        value: danceValue,
        onChange: onChangeDanceValue,
      },
      {
        name: "試験前のビジュアル(Vi)",
        htmlId: "parameterInputVisual",
        value: visualValue,
        onChange: onChangeVisualValue,
      },
    ],
    [
      vocalValue,
      onChangeVocalValue,
      danceValue,
      onChangeDanceValue,
      visualValue,
      onChangeVisualValue,
    ],
  );
  const onFocusParameterInput = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      event.currentTarget.select();
    },
    [],
  );
  const finalExamCalculation = useFinalExamCalculation();
  return (
    <main style={pageStyles}>
      <h1 style={h1Styles}>{siteTitle}</h1>
      <table style={userInputsTableStyles}>
        <tbody>
          <tr>
            <td>
              <label htmlFor="finalExamRankInput">最終試験順位</label>
            </td>
            <td>
              <select
                id="finalExamRankInput"
                value={finalExamRank}
                onChange={onChangeFinalExamRank}
              >
                <option value="1">1位</option>
                <option value="2">2位</option>
                <option value="3">3位</option>
              </select>
            </td>
          </tr>
          {idolParameterInputs.map((idolParameterInput) => (
            <tr key={idolParameterInput.htmlId}>
              <td>
                <label htmlFor={idolParameterInput.htmlId}>
                  {idolParameterInput.name}:
                </label>
              </td>
              <td>
                <input
                  type="number"
                  id={idolParameterInput.htmlId}
                  style={parameterValueInput}
                  value={idolParameterInput.value}
                  onChange={idolParameterInput.onChange}
                  onFocus={onFocusParameterInput}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={arrowDownStyle}>⇩</div>
      <h2 style={h2Styles}>必要な最終試験スコア</h2>
      <table style={necessaryFinalExamScoresTableStyles}>
        <tbody>
          {finalExamCalculation.necessaryFinalExamScores.map(
            (necessaryFinalExamScore) => (
              <tr key={necessaryFinalExamScore.rank}>
                <td style={necessaryFinalExamScoresTableRankTdStyles}>
                  {necessaryFinalExamScore.rank}
                </td>
                <td style={necessaryFinalExamScoresTableScoreTdStyles}>
                  {necessaryFinalExamScore.score}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      <h2 style={h2Styles}>ランク評価点計算式</h2>
      <ul>
        <li>
          最終試験の順位は、1位:1,700、2位:900、3位:500を評価点へ加算する。
        </li>
        <li>
          アイドルのパラメータは、合計値の2.3倍（端数切り捨て）を評価点へ加算する。なお、最終試験によるパラメータの上昇は、1位:30、2位:20、3位:10。
        </li>
        <li>
          最終試験のスコアは、0-5,000までは0.3倍、5,001-10,000までは0.15倍、10,001-20,000までは0.08倍、20,001-30,000までは0.04倍、30,001-40,000までは0.02倍、40,001以上は0.01倍（いずれも端数切り捨て）を評価点へ加算する。
        </li>
        <li>
          評価点によりランクが決まる。S:13,001以上、A+:11,501以上、A:10,001以上、B+:8,001以上、B:6,001以上、C+:5,001以上、C:3,001以上、D:3,000以下。
        </li>
        <li>
          本計算式は、主に
          <a href="https://docs.google.com/spreadsheets/u/0/d/1eEdzfHGi7iXpohR-UHr5-W1z7PcYBqQr8OAV7gcvhR8/htmlview">
            学マス評価値計算機(公開用)
          </a>
          を参考にさせていただきました。
        </li>
      </ul>
      <h2 style={h2Styles}>参考・関連リンク</h2>
      <ul>
        <li>
          <a href="https://github.com/kjirou/gakumasu-final-exam-checker">
            GitHub
          </a>
        </li>
      </ul>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>{siteTitle}</title>;
