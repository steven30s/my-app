# 智能财务助手 - GitHub Pages 部署指南

## 前置要求
1. 已安装 [Git](https://git-scm.com/)
2. 已安装 [Node.js](https://nodejs.org/) (推荐 LTS 版本)
3. 已安装 [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
4. GitHub 账号

## 部署步骤

### 1. 准备项目
```bash
# 克隆项目
git clone https://github.com/your-username/finance-assistant.git
cd finance-assistant

# 安装依赖
pnpm install

# 添加 gh-pages 部署工具
pnpm add -D gh-pages
```

### 2. 配置 GitHub 仓库
1. 在 GitHub 上创建新仓库，命名为 `finance-assistant`
2. 将本地项目与远程仓库关联：
```bash
git remote add origin https://github.com/your-username/finance-assistant.git
git branch -M main
git push -u origin main
```

### 3. 修改项目配置
确保 `vite.config.ts` 中的 `base` 设置为 `'/finance-assistant/'`

### 4. 构建并部署
```bash
# 构建项目
pnpm build

# 部署到 GitHub Pages
pnpm deploy
```

### 5. 启用 GitHub Pages
1. 进入仓库的 Settings > Pages
2. 选择 `gh-pages` 分支作为源
3. 选择 `/ (root)` 文件夹
4. 点击 Save

### 6. 访问应用
部署完成后，应用将在以下地址可用：
```
https://your-username.github.io/finance-assistant/
```

## 注意事项
1. 首次部署可能需要等待几分钟才能生效
2. 确保所有资源路径使用相对路径
3. 如果遇到 404 错误，请检查 vite.config.ts 中的 base 设置
4. PWA 功能需要 HTTPS 环境才能正常工作

## 更新部署
修改代码后，只需重新运行：
```bash
pnpm deploy
```