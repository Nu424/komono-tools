# prompts.md
作ってもらうのに使ったプロンプト置き場です

## electrode-potential-converter.html
```
電極の電位変換を計算するウェブツールを、html,css,jsで作成してください。
- 入力は、以下の通りとします
  - 変換の方向(RHE基準電位→各電極基準電位、またはその逆)
  - 溶液のpH
  - RT/F (基本は0.0591)
  - 使用する電極(Ag/AgClなど、代表的なものをプルダウンで選択できるようにする)
  - 電位①、電位②(変換する電位。CVの範囲を計算するために、2口入力できるようにする)
- 計算は瞬時におこないます(計算ボタンなどは用意せず、入力が変化したときに即出力も変化するようにします
- 計算式も表示します。KaTeXを使用して描画します
  - 計算式の横あたりにiボタンみたいなのを用意し、それを押すとモーダル内で計算の解説が表示される…みたいな感じにしたいです。
- モバイルファーストで作成します。1画面(svh)に収まるようにします
- 各入力値はlocalStorageに保存し、永続化します

- htmlファイル1つにまとめ、その中でReact・TailwindCSSを使って構築してください。
```

## nt-xafs-condition-maker.html
```
辞書作る
WebUI

----------
XAFSの測定条件を作成するWebツールを作成します。

## 流れ

プルダウンで、吸収端を選択する
　吸収端データを用意しておく。
　オートコンプリートできるようにする(autoComplete.jsとかで)
パラメータを入力する
　基本的に、グラフィカルな入力欄でおこなう
　　@を参考にする
　　(SVGの位置はすでに調整済みです)
　Epre_min、Epre_max、XANES_k_end、kmax
　numstep、numstep_xanes、exposure_timeは、別の欄を追加して入力する

　画面として、グラフィカルな入力をシンプルにまとめた欄も用意する
　　この欄には、E0、Epre_min、Epre_max、XANES_k_end、kmax、numstep、numstep_xanes、exposureを、この順で表のような形にまとめる

　　予測測定時間を表示する
　　　計算式は、{ numstep + numstep_xanes + numstep*(kmax-XANES_k_end) } * (exposure_time + 1.3)

詳細調整表をレンダリングする
　(グラフィカル入力欄で大まかに調整し、より細かく調整したいときは、詳細調整表で細かく調整するようなイメージ)
　「現在のパラメータから測定条件表を更新する」ボタンを押して、データ作成・レンダリングする
　表は、以下のヘッダーを持つ
　　Init-Energy、Final-Energy、Number-of-steps、Exposure-time、Step-energy、Init-k、Final-k
　1行目：XANES前の領域について
　　Init-Energy：E0-Epre_min
　　Final-Energy：E0-Epre_max
　　Number-of-steps：numstep
　　Exposure-time：exposure
　　Step-energy：(Final-Energy)-(Init-Energy) / (Number-of-steps)
　　Init-k：None
　　Final-k：None
　2行目：XANES領域について
　　Init-Energy：(1つ前の行のFinal-Energy)
　　Final-Energy：E0+(XANES_k_endをエネルギーに変換した値)
　　Number-of-steps：numstep_xanes
　　Exposure-time：exposure
　　Step-energy：(Final-Energy)-(Init-Energy) / (Number-of-steps)
　　Init-k：None
　　Final-k：XANES_k_end
　3行目以降：EXAFS領域について。k基準で考え、k1ごとに行を作る。kがkmaxになったら終了
　　Init-Energy：(1つ前の行のFinal-Energy)
　　Final-Energy：E0+(Final-kをエネルギーに変換した値)
　　Number-of-steps：numstep
　　Exposure-time：exposure
　　Step-energy：(Final-Energy)-(Init-Energy) / (Number-of-steps)
　　Init-k：(1つ前の行のFinal-k)
　　Final-k：Init-k+1
　(入力されたパラメータから表データを更新するのは、「現在のパラメータから測定条件表を更新する」ボタンを押したときのみ)
　各値は入力して変更できる。
　詳細な予測測定時間も表示する
　　各行について、ステップ数*(露光時間+1.3)を計算して、合計する

　csv形式で出力できるようにする
　　「XAFS_measurement_condition_YYYYMMDDhhmmss.csv」の形式

## 技術
React(ブラウザ単独の), tailwindcss, zustand

## そのほか
- htmlファイル1つにまとめ、その中でReact・TailwindCSSを使って構築してください。
- コードは適度に関数分けし(分け過ぎもよくわからなくなることに注意)、それぞれの関数・コードには、適切なJSDoc, コメントを日本語で付けてください。

```