# 🧺 ランドリー稼働状況チェッカー

コインランドリーの洗濯機・乾燥機の稼働状況をリアルタイムで確認できるWebアプリです。

## 機能

- 🔄 洗濯機・乾燥機の稼働状況をリアルタイム表示
- 🌐 多言語対応（日本語、英語、中国語、韓国語など）
- ⏱️ 残り時間の表示
- 📱 レスポンシブデザイン

## ローカルで実行

**必要なもの:** Node.js 20以上

1. 依存関係をインストール:
   ```bash
   npm install
   ```

2. `.env.local`に`GEMINI_API_KEY`を設定

3. アプリを起動:
   ```bash
   npm run dev
   ```

## GitHub Pagesへのデプロイ

### 1. リポジトリを作成

GitHubで新しいリポジトリを作成します（例: `laundry-checker`）

### 2. コードをプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
git push -u origin main
```

### 3. Secretsを設定

リポジトリの Settings → Secrets and variables → Actions → New repository secret で:
- **Name:** `GEMINI_API_KEY`
- **Secret:** あなたのGemini APIキー

### 4. GitHub Pagesを有効化

Settings → Pages で:
- **Source:** GitHub Actions を選択

### 5. デプロイ

`main`ブランチにプッシュすると自動的にデプロイされます。

公開URL: `https://あなたのユーザー名.github.io/リポジトリ名/`

## ライセンス

MIT License
