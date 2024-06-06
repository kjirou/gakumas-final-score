import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import Layout from "../../layouts/layout";
import {
  type FinalExamRank,
  type IdolParameters,
  calculateNecessaryFinalExamScores,
  finalExamRanks,
  formatIntegerStringWithCommas,
} from "../../utils";
import * as styles from "./index.module.css";

const siteUrl = "https://gakumas-final-score.netlify.app/";
const siteTitle = "学マス最終試験スコア計算ツール";
const siteSummary =
  "学園アイドルマスターの最終試験で、S/A+ランクのために必要なスコアを計算するツール";
const ogImageUrl = `${siteUrl}og-image.png`;

const useCalculateNecessaryFinalExamScores = (
  finalExamRank: FinalExamRank,
  vocalValue: IdolParameters["vocal"],
  danceValue: IdolParameters["dance"],
  visualValue: IdolParameters["visual"],
) => {
  return React.useMemo(
    () =>
      calculateNecessaryFinalExamScores(
        finalExamRank,
        { vocal: vocalValue, dance: danceValue, visual: visualValue },
        () => {},
      ),
    [finalExamRank, vocalValue, danceValue, visualValue],
  );
};

export const IndexPage: React.FC<PageProps> = () => {
  const [finalExamRank, setFinalExamRank] = React.useState<FinalExamRank>("1");
  const onChangeFinalExamRank = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      // TODO: Type guard
      setFinalExamRank(event.currentTarget.value as FinalExamRank);
    },
    [],
  );
  const [vocalValue, setVocalValue] = React.useState(1000);
  const [danceValue, setDanceValue] = React.useState(1000);
  const [visualValue, setVisualValue] = React.useState(1000);
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
        className: "vocalColor",
        onChange: onChangeVocalValue,
      },
      {
        name: "試験前のダンス(Da)",
        htmlId: "parameterInputDance",
        value: danceValue,
        className: "danceColor",
        onChange: onChangeDanceValue,
      },
      {
        name: "試験前のビジュアル(Vi)",
        htmlId: "parameterInputVisual",
        value: visualValue,
        className: "visualColor",
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
  const necessaryFinalExamScores = useCalculateNecessaryFinalExamScores(
    finalExamRank,
    vocalValue,
    danceValue,
    visualValue,
  );
  return (
    <Layout>
      <main className={styles.page}>
        <h1>{siteTitle}</h1>
        <p className={styles.siteSummary}>{siteSummary}</p>
        <table className={styles.idolParameterInputs}>
          <tbody>
            <tr>
              <th>
                <label htmlFor="finalExamRankInput">最終試験順位</label>
              </th>
              <td>
                <select
                  id="finalExamRankInput"
                  value={finalExamRank}
                  onChange={onChangeFinalExamRank}
                >
                  {Object.keys(finalExamRanks).map((finalExamRankKey) => (
                    <option key={finalExamRankKey} value={finalExamRankKey}>
                      {finalExamRankKey}位
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            {idolParameterInputs.map((idolParameterInput) => (
              <tr key={idolParameterInput.htmlId}>
                <th>
                  <label
                    htmlFor={idolParameterInput.htmlId}
                    className={styles[idolParameterInput.className]}
                  >
                    {idolParameterInput.name}:
                  </label>
                </th>
                <td>
                  <input
                    type="number"
                    inputMode="numeric"
                    id={idolParameterInput.htmlId}
                    value={idolParameterInput.value}
                    onChange={idolParameterInput.onChange}
                    onFocus={onFocusParameterInput}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.arrowDown}>
          <div />
        </div>
        <h2>必要な最終試験スコア</h2>
        <table className={styles.necessaryFinalExamScores}>
          <tbody>
            {necessaryFinalExamScores.map((necessaryFinalExamScore) => (
              <tr key={necessaryFinalExamScore.name}>
                <th>{necessaryFinalExamScore.name}</th>
                <td>
                  {formatIntegerStringWithCommas(
                    String(necessaryFinalExamScore.necessaryScore),
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>ランク評価点計算式解説</h2>
        <ul>
          <li>難易度はプロ前提、レギュラーで同じ結果になるかは不明。</li>
          <li>
            最終試験の順位は、1位:1,700、2位:900、3位:500を評価点へ加算する。
          </li>
          <li>
            アイドルのパラメータは、合計値の2.3倍（端数切り捨て）を評価点へ加算する。なお、最終試験による全パラメータの上昇は、1位:30、2位:20、3位:10。
          </li>
          <li>
            最終試験のスコアは、0から5,000までは0.3倍、5,001から10,000までは0.15倍、10,001から20,000までは0.08倍、20,001から30,000までは0.04倍、30,001から40,000までは0.02倍、40,001以上は0.01倍（いずれも端数切り捨て）を評価点へ加算する。
          </li>
          <li>
            評価点によりランクが決まる。S:13,000以上、A+:11,500以上、A:10,000以上、B+:8,000以上、B:6,000以上、C+:4,500以上、C:3,000以上、D:3,000以下。
          </li>
          <li>
            本計算式は、
            <a href="https://docs.google.com/spreadsheets/d/1eEdzfHGi7iXpohR-UHr5-W1z7PcYBqQr8OAV7gcvhR8/edit#gid=0">
              学マス評価値計算機
            </a>
            を参考にした。多謝！
          </li>
        </ul>
        <h2>参考・関連リンク</h2>
        <ul>
          <li>
            <a href="https://github.com/kjirou/gakumas-final-score">GitHub</a>
          </li>
        </ul>
      </main>
    </Layout>
  );
};

export const IndexPageHead: HeadFC = () => (
  <>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={siteSummary} />
    <meta
      name="keywords"
      content="学園アイドルマスター,学マス,最終試験スコア,評価値,アイドルランク,クリアランク"
    />
    <meta property="og:title" content={siteTitle} />
    <meta property="og:description" content={siteSummary} />
    <meta property="og:image" content={ogImageUrl} />
    <title>{siteTitle}</title>
  </>
);
