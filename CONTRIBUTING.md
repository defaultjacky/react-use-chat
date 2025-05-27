# 贡献指南

感谢你考虑为 React Use Dialog 做出贡献！我们欢迎任何形式的贡献，无论是报告问题、建议新功能还是提交代码。

## 开发环境设置

1. Fork 这个仓库
2. 克隆你的 fork：
   ```bash
   git clone https://github.com/your-username/react-use-dialog.git
   cd react-use-dialog
   ```
3. 安装依赖：
   ```bash
   npm install
   ```
4. 创建一个新分支：
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 开发工作流

### 运行测试

```bash
npm test
```

### 构建项目

```bash
npm run build
```

### 运行示例

```bash
cd example
npm install
npm start
```

### 代码检查

```bash
npm run lint
npm run type-check
```

## 提交代码

1. 确保所有测试通过：`npm test`
2. 确保代码符合规范：`npm run lint`
3. 确保类型检查通过：`npm run type-check`
4. 提交你的更改：
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   ```
5. 推送到你的分支：
   ```bash
   git push origin feature/your-feature-name
   ```
6. 创建 Pull Request

## 提交信息规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式修改
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

## 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 为新功能添加测试
- 更新相关文档
- 保持 API 的向后兼容性

## 问题报告

如果你发现了 bug，请创建一个 issue 并包含：

1. 问题的详细描述
2. 重现步骤
3. 期望的行为
4. 实际的行为
5. 环境信息（Node.js 版本、React 版本等）
6. 最小可重现示例

## 功能请求

如果你有新功能的想法，请创建一个 issue 并包含：

1. 功能的详细描述
2. 使用场景和动机
3. 可能的实现方案
4. 示例代码（如果适用）

## Pull Request 指南

1. 确保 PR 描述清楚地说明了你的更改
2. 链接到相关的 issue（如果有）
3. 包含足够的测试覆盖率
4. 更新相关文档
5. 确保 CI 检查通过

## 代码审查

所有的 Pull Request 都会经过代码审查。审查者会检查：

- 代码质量和可读性
- 测试覆盖率
- 文档完整性
- API 设计
- 性能影响

## 社区准则

- 保持友善和专业
- 尊重不同的观点和经验
- 提供建设性的反馈
- 帮助新贡献者

## 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

---

再次感谢你的贡献！如果有任何问题，请随时在 issue 中提问。 