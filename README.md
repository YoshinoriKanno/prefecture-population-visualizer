# 都道府県別人口推移ビジュアライザー

![Screen Shot](https://github.com/YoshinoriKanno/prefecture-population-visualizer/raw/main/screenshot.png)

このアプリは、日本の各都道府県の人口推移データをビジュアル化するためのツールです。オープンデータを活用して、各都道府県の総人口、年少人口、生産年齢人口、老年人口をチェックボックスで選択し、簡単に折れ線グラフで比較することができます。

## 特徴

- **データソース:** RESAS（地域経済分析システム）オープンデータからデータを取得
- **ビジュアライゼーション:** Highchartsを使用した美しい折れ線グラフ
- **選択可能なカテゴリ:** 総人口、年少人口、生産年齢人口、老年人口
- **都道府県選択:** チェックボックスで都道府県の人口推移データを表示/非表示切り替え

## 使用技術

- **フロントエンド:** React
- **グラフライブラリ:** Highcharts
- **API:** RESASオープンデータAPI

## 必要条件

- Node.js（バージョンはVoltaによって固定済み）
- npm

## 環境変数

RESAS APIキーを使用するために、`.env` ファイルをプロジェクトのルートに作成し、以下の内容を追加してください:

```plaintext
REACT_APP_API_KEY=YOUR_API_KEY
```

RESAS APIキーは RESAS APIの利用登録(無料)を行い、API Keyを発行してください。 https://opendata.resas-portal.go.jp/

## インストール手順

1. リポジトリをクローンします。

```
git clone https://github.com/YoshinoriKanno/prefecture-population-visualizer.git
cd prefecture-population-visualizer
```

2. 必要な依存関係をインストールします。

```
npm install
```

3. アプリケーションを起動します。

```
npm start
```

## Prettier

```
npm run prettier
```

build 時に ESLint が捜査します。

## ESLint

build 時に ESLint が捜査します。

## デプロイ

このアプリはGitHub Pagesにデプロイできます。

デプロイを行うために次のコマンドを実行します。

```
npm run deploy
```

## Github Pages

アプリの URL です。

https://yoshinorikanno.github.io/prefecture-population-visualizer/

## 都道府県のリストが表示されない場合

都道府県のリストが表示されない場合、指定されたAPIキーが無効であるか、廃止されたバージョンや開発中のバージョンを参照している可能性があります。

もしこの問題が発生した場合は、[Issues](https://github.com/YoshinoriKanno/prefecture-population-visualizer/issues)にてお知らせください。
