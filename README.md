# komono-tools
こまごましてるツールをまとめたリポジトリ

## ツール一覧
- [electrode-potential-converter.html](https://nu424.github.io/komono-tools/electrode-potential-converter.html): 電極電位変換ツール
- [nt-xafs-condition-maker.html](https://nu424.github.io/komono-tools/nt-xafs-condition-maker.html): NT用、XAFSの条件設定ツール

## つくりかた
各ツールはHTMLファイル1枚で完結しています。CSSは`<style>`に、JavaScriptは`<script>`に同梱してあり、
ビルドもパッケージのインストールも要りません。ファイルをブラウザで開けばそのまま動きます。

外部から読み込んでいるものは、`electrode-potential-converter.html`の数式組版に使っている
[KaTeX](https://katex.org/)だけです（CDN経由）。読み込めなかった場合も、数式のソースを
そのまま表示して動作は続きます。

以前はReact・Tailwind CSSをCDNから読み込み、ブラウザ上でJSXを変換して動かしていましたが、
初回表示が遅く、CDNの更新でツールが壊れることもあったため、素のHTML/CSS/JavaScriptに書き直しました。
