<p align="center">
  <a href="https://www.newt.so/">
    <img src="https://user-images.githubusercontent.com/3859812/155490725-80ed1f06-996e-407f-8f63-fd54f0acaf14.svg" alt="Newt" width="70" height="57" />
  </a>
</p>
<h3 align="center">
Newt's starter
</h3>
<p align="center">
  <a href="https://demo-newt-blog2-starter-nextjs.vercel.app/">Demo</a> | <a href="https://www.newt.so/">Newt</a>
</p>

## 概要

**newt-blog2-starter-nextjs**
<br />Newt を利用した 2 カラム版のブログ
<br />技術構成： Next.js, TypeScript

## 開発をはじめる

### Step1: Newt スペースをセットアップ

1. スペースを作成します
   - スペース UID を控えておきましょう。スペース UID は 管理画面 URL（ `https://app.newt.so/{スペースUID}` ） もしくは スペース設定 > 一般 から確認できます。
2. App を作成します
   - App テンプレートから作成する場合、**Blog2**を選択し「このテンプレートを追加」をクリックしてください。
   - スクラッチで作成する場合は、App 名と AppUID を設定して次のステップに進みます。
   - AppUID を控えておきましょう。AppUID は管理画面 URL（ `https://app.newt.so/{スペースUID}/app/{AppUID}` ） または App 設定 > 一般 から確認できます。
3. App 設定から、Article モデル, Tag, Author モデルを作成します
   - App テンプレートから作成した場合、すでにモデルが作成されているためこのステップは飛ばします
   - スクラッチで作成した場合は、[Newt スペースの構成](#Newtスペースの構成)に従って App とモデルを作成します
4. スペース設定 > API キー から CDN API トークンを作成します
   - スペース設定 > API キー より CDN API トークンを作成します
   - 複製マークをクリックしてトークンをコピーしましょう

### Step2: .env ファイルを書き換える

1. Step1 で取得したスペース UID, AppUID, CDN API トークンで環境変数を書き換えます

.env ファイルのスペース UID, AppUID, CDN API トークンを実際の値で書き換えます

```conf
NEXT_PUBLIC_NEWT_SPACE_UID=スペースUID
NEXT_PUBLIC_NEWT_APP_UID=AppUID
NEXT_PUBLIC_NEWT_API_TOKEN=CDN APIトークン
NEXT_PUBLIC_NEWT_API_TYPE=cdn
NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID=article
NEXT_PUBLIC_NEWT_TAG_MODEL_UID=tag
NEXT_PUBLIC_NEWT_AUTHOR_MODEL_UID=author
NEXT_PUBLIC_PAGE_LIMIT=12

```

Next.js における環境変数の扱いについては、[公式ドキュメント](https://nextjs.org/docs/basic-features/environment-variables)を参照してください。

### Step3: dev サーバーを起動する

Yarn を使う

```bash
# 依存パッケージをインストール
$ yarn install

# localhost:3000でdevサーバーを起動
$ yarn dev
```

NPM を使う

```bash
# 依存パッケージをインストール
$ npm install

# localhost:3000でdevサーバーを起動
$ npm run dev
```

### Step4: Static なサイトを生成して起動

```bash
# Staticなサイトを生成（SSG）
$ yarn generate

# サーバーを起動
$ yarn start
```

## Newt スペースの構成

`Blog2` app の中に Article, Tag, Author の 3 つのモデルを作ります。

| App 名（任意） | モデル名（モデル UID） |
| -------------- | ---------------------- |
| Blog2          | Article (`article`)    |
|                | Tag (`tag`)            |
|                | Author (`author`)      |

### Article（`uid: article`）モデル

| フィールド ID | フィールド名 | フィールドタイプ           | オプション                                     |
| ------------- | ------------ | -------------------------- | ---------------------------------------------- |
| title         | タイトル     | テキスト                   | 必須フィールド, このフィールドをタイトルに使う |
| slug          | スラッグ     | テキスト                   | 必須フィールド                                 |
| meta          | メタ情報     | カスタムフィールド         |                                                |
| coverImage    | カバー画像   | 画像                       |                                                |
| body          | 本文         | Markdown or リッチテキスト |                                                |
| tags          | カテゴリ     | 参照（Tag モデル）         | 複数値                                         |
| author        | 著者         | 参照（Author モデル）      |                                                |

### Tag(`uid: tag`）モデル

| フィールド ID | フィールド名 | フィールドタイプ | オプション                                     |
| ------------- | ------------ | ---------------- | ---------------------------------------------- |
| name          | 名前         | テキスト         | 必須フィールド, このフィールドをタイトルに使う |
| slug          | スラッグ     | テキスト         | 必須フィールド                                 |

### Author（`uid: author`）モデル

| フィールド ID | フィールド名     | フィールドタイプ           | オプション                                     |
| ------------- | ---------------- | -------------------------- | ---------------------------------------------- |
| fullName      | 名前             | テキスト                   | 必須フィールド, このフィールドをタイトルに使う |
| slug          | スラッグ         | テキスト                   | 必須フィールド                                 |
| profileImage  | プロフィール画像 | 画像                       |                                                |
| biography     | 自己紹介         | Markdown or リッチテキスト |                                                |

### メタ情報（`id: META`）カスタムフィールドタイプ

| フィールド ID | フィールド名 | フィールドタイプ | オプション |
| ------------- | ------------ | ---------------- | ---------- |
| title         | Title        | テキスト         |            |
| description   | Description  | テキスト         |            |
| ogImage       | OG 画像      | 画像             |            |
