# React Use Chat

[![npm version](https://badge.fury.io/js/react-use-chat.svg)](https://badge.fury.io/js/react-use-chat)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

一个用于构建对话式引导流程的 React Hook，支持单选、多选和嵌套分支处理。

[English](./README.en.md) | 中文

## ✨ 特性

- 🎯 **对话式交互** - 以聊天形式引导用户完成复杂流程
- 🎛️ **多种选择类型** - 支持单选、多选和自动完成
- 🌳 **嵌套分支处理** - 支持多层嵌套的复杂对话树
- 🎨 **灵活配置** - 支持自定义执行顺序和互斥选项
- 📝 **历史记录** - 自动记录用户的选择历史
- 🎁 **计划推荐** - 基于用户选择生成个性化推荐
- 📱 **响应式** - 支持桌面和移动端
- 🔧 **TypeScript** - 完整的类型定义支持
- 🪝 **React Hooks** - 现代 React 开发模式
- ⚡ **轻量级** - 无额外依赖，体积小巧

## 📦 安装

```bash
npm install react-use-chat
```

```bash
yarn add react-use-chat
```

```bash
pnpm add react-use-chat
```

## 🚀 快速开始

### 基础用法

```tsx
import React from 'react';
import { useDialog } from 'react-use-chat';

const dialogData = [
  {
    node_id: 'welcome',
    question_text: '你想学习什么？',
    answer_type: 'single_select',
    answers: [
      {
        answer_id: 'math',
        answer_text: '数学',
        next_node_id: 'math_level',
        plan_trigger: null,
      },
      {
        answer_id: 'english',
        answer_text: '英语',
        next_node_id: null,
        plan_trigger: '英语学习计划',
      },
    ],
  },
  {
    node_id: 'math_level',
    question_text: '选择你的数学水平：',
    answer_type: 'multi_select',
    answers: [
      {
        answer_id: 'basic',
        answer_text: '基础',
        next_node_id: null,
        plan_trigger: '基础数学',
      },
      {
        answer_id: 'advanced',
        answer_text: '高级',
        next_node_id: null,
        plan_trigger: '高级数学',
      },
    ],
  },
];

function App() {
  const {
    currentNode,
    history,
    selectedAnswers,
    handleSelection,
    handleMultiSelect,
    confirmSelections,
    resetDialog,
  } = useDialog(dialogData);

  if (!currentNode) {
    return <div>对话已完成</div>;
  }

  return (
    <div>
      <h2>{currentNode.question_text}</h2>
      
      {currentNode.answer_type === 'single_select' && (
        <div>
          {currentNode.answers.map((answer) => (
            <button
              key={answer.answer_id}
              onClick={() => handleSelection(answer.answer_id)}
            >
              {answer.answer_text}
            </button>
          ))}
        </div>
      )}

      {currentNode.answer_type === 'multi_select' && (
        <div>
          {currentNode.answers.map((answer) => (
            <label key={answer.answer_id}>
              <input
                type="checkbox"
                checked={selectedAnswers.includes(answer.answer_id)}
                onChange={() => handleMultiSelect(answer.answer_id)}
              />
              {answer.answer_text}
            </label>
          ))}
          <button 
            onClick={confirmSelections}
            disabled={selectedAnswers.length === 0}
          >
            确认选择
          </button>
        </div>
      )}
    </div>
  );
}
```

### 使用 Context Provider（可选）

对于复杂的应用程序，你也可以使用 Context Provider 方式：

```tsx
import React from 'react';
import { DialogProvider, useDialogContext } from 'react-use-chat';

function DialogComponent() {
  const { currentNode, handleSelection } = useDialogContext();
  // ... 组件逻辑
}

function App() {
  return (
    <DialogProvider dialogData={dialogData}>
      <DialogComponent />
    </DialogProvider>
  );
}
```

## 📚 API 参考

### useDialog Hook

```tsx
const result = useDialog(dialogData, options);
```

#### 参数

| 参数 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `dialogData` | `DialogNode[]` | ✅ | 对话节点数据数组 |
| `options` | `UseDialogOptions` | ❌ | 配置选项 |

#### 选项 (UseDialogOptions)

```tsx
interface UseDialogOptions {
  initialNodeId?: string;        // 初始节点 ID
  findNodeById?: (nodeId: string) => DialogNode | null; // 自定义节点查找函数
  autoCompleteDelay?: number;    // 自动完成延迟时间（毫秒）
}
```

#### 返回值 (UseDialogReturn)

```tsx
interface UseDialogReturn {
  currentNode: DialogNode | null;           // 当前节点
  history: HistoryItem[];                   // 历史记录
  learningPlan: string[];                   // 学习计划
  selectedAnswers: string[];                // 已选择的答案
  multiSelectBranchStack: SelectionBranch[][]; // 多选分支栈
  currentBranchIndices: number[];           // 分支索引
  pendingPlanTriggers: string[];            // 待处理的计划触发器
  handleSelection: (answerId: string) => void;      // 处理单选
  handleMultiSelect: (answerId: string) => void;    // 处理多选
  confirmSelections: () => void;            // 确认多选
  resetDialog: () => void;                  // 重置对话
}
```

### 数据结构

#### DialogNode

```tsx
interface DialogNode {
  node_id: string;                    // 节点唯一标识
  question_text: string;              // 问题文本
  answer_type: AnswerType;            // 答案类型
  answers: DialogAnswer[];            // 答案选项
  default_next_node_id?: string | null;     // 默认下一节点（auto_complete 类型）
  default_plan_trigger?: string | null;     // 默认计划触发器
  execute_by_config_order?: boolean;  // 是否按配置顺序执行
  is_branch_end?: boolean;            // 是否为分支结束节点
}
```

#### DialogAnswer

```tsx
interface DialogAnswer {
  answer_id: string;           // 答案唯一标识
  answer_text: string;         // 答案文本
  next_node_id: string | null; // 下一个节点 ID
  plan_trigger: string | null; // 计划触发器
  execution_order?: number;    // 执行顺序
  mutually_exclusive?: boolean; // 是否互斥
}
```

#### AnswerType

```tsx
type AnswerType = "single_select" | "multi_select" | "auto_complete";
```

## 🎯 高级用法

### 嵌套多选分支

系统支持复杂的嵌套多选场景：

```tsx
const complexDialogData = [
  {
    node_id: 'subjects',
    question_text: '选择你想学习的学科：',
    answer_type: 'multi_select',
    execute_by_config_order: true,
    answers: [
      {
        answer_id: 'math',
        answer_text: '数学',
        next_node_id: 'math_topics', // 指向另一个多选节点
        plan_trigger: null,
        execution_order: 0,
      },
      {
        answer_id: 'english',
        answer_text: '英语',
        next_node_id: 'english_skills', // 指向另一个多选节点
        plan_trigger: null,
        execution_order: 1,
      },
    ],
  },
  // 数学主题的多选节点
  {
    node_id: 'math_topics',
    question_text: '选择数学学习重点：',
    answer_type: 'multi_select',
    answers: [
      {
        answer_id: 'algebra',
        answer_text: '代数',
        next_node_id: null,
        plan_trigger: '代数学习计划',
      },
      {
        answer_id: 'geometry',
        answer_text: '几何',
        next_node_id: null,
        plan_trigger: '几何学习计划',
      },
    ],
  },
  // ... 更多节点
];
```

### 互斥选项

在多选模式下，可以设置互斥选项：

```tsx
{
  node_id: 'level_selection',
  question_text: '选择你的水平和学习偏好：',
  answer_type: 'multi_select',
  answers: [
    {
      answer_id: 'beginner',
      answer_text: '初学者',
      mutually_exclusive: true, // 与其他水平选项互斥
      next_node_id: null,
      plan_trigger: '初学者计划',
    },
    {
      answer_id: 'advanced',
      answer_text: '高级',
      mutually_exclusive: true, // 与其他水平选项互斥
      next_node_id: null,
      plan_trigger: '高级计划',
    },
    {
      answer_id: 'visual_learner',
      answer_text: '视觉学习者',
      next_node_id: null,
      plan_trigger: '视觉学习计划',
    },
  ],
}
```

### 自动完成节点

```tsx
{
  node_id: 'processing',
  question_text: '正在生成你的个性化学习计划...',
  answer_type: 'auto_complete',
  answers: [],
  default_next_node_id: 'results',
  default_plan_trigger: null,
}
```

### 自定义节点查找

```tsx
const { currentNode } = useDialog(dialogData, {
  findNodeById: (nodeId) => {
    // 自定义查找逻辑，比如从 API 获取
    return fetch(`/api/nodes/${nodeId}`).then(res => res.json());
  },
});
```

### 滚动事件监听

Hook 会在对话更新时派发滚动事件：

```tsx
import { SCROLL_TO_BOTTOM_EVENT } from 'react-use-chat';

useEffect(() => {
  const handleScroll = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  document.addEventListener(SCROLL_TO_BOTTOM_EVENT, handleScroll);
  return () => document.removeEventListener(SCROLL_TO_BOTTOM_EVENT, handleScroll);
}, []);
```

## 🎨 样式定制

Hook 本身不包含样式，你可以完全自定义 UI。参考示例项目中的 CSS：

## 🔧 开发

### 安装依赖

```bash
npm install
```

### 构建

```bash
npm run build
```

### 测试

```bash
npm test
```

### 运行示例

```bash
cd example
npm install
npm start
```

## 📄 许可证

MIT © [JACKYZ](https://github.com/defaultjacky)

## 🤝 贡献

欢迎贡献代码！请阅读 [贡献指南](./CONTRIBUTING.md) 了解详情。

### 贡献者

<a href="https://github.com/defaultjacky/react-use-chat/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=defaultjacky/react-use-chat" />
</a>

## 📮 支持

- 💬 [GitHub Discussions](https://github.com/defaultjacky/react-use-chat/discussions)
- 🐛 [GitHub Issues](https://github.com/defaultjacky/react-use-chat/issues)
- 📧 [邮件支持](mailto:defaultjacky@gmail.com)

---

如果这个项目对你有帮助，请给个 ⭐️ 支持一下！

## ⚙️ 核心概念与详细用法

`react-use-chat` 的核心是 `useDialog` Hook，它接收对话数据和可选配置，并返回管理对话流程所需的状态和函数。

### 1. 对话数据结构 (`DialogNode[]`)

对话数据是一个 `DialogNode`对象的数组。每个 `DialogNode` 代表对话中的一个步骤或问题。

```typescript
interface DialogNode {
  node_id: string;                    // 节点唯一标识，用于导航
  question_text: string;              // 当前节点显示给用户的问题或信息
  answer_type: AnswerType;            // 答案类型: "single_select" | "multi_select" | "auto_complete"
  answers: DialogAnswer[];            // 答案选项数组
  default_next_node_id?: string | null; // (可选) 主要用于 'auto_complete' 类型，在无特定答案交互时，自动转换到下一个节点
  default_plan_trigger?: string | null; // (可选) 主要用于 'auto_complete' 类型，自动触发的计划
  execute_by_config_order?: boolean;  // (可选, 仅用于 multi_select) 如果为 true，多选确认后，将严格按照 answers 数组中配置的顺序依次处理每个选中项对应的分支
  is_branch_end?: boolean;            // (可选) 标记此节点是否为一个分支的逻辑末端，即使它有 next_node_id
}

interface DialogAnswer {
  answer_id: string;           // 答案唯一标识
  answer_text: string;         // 显示给用户的答案文本
  next_node_id: string | null; // 选择此答案后要跳转到的下一个 node_id。如果为 null，表示当前路径结束
  plan_trigger: string | null; // (可选) 选择此答案后触发的计划/标签，会收集到 learningPlan 数组中
  execution_order?: number;    // (可选, 仅用于 multi_select 且 execute_by_config_order 为 false 时) 定义多选分支处理的优先级，数字越小优先级越高
  mutually_exclusive?: boolean; // (可选, 仅用于 multi_select) 如果为 true，选择此答案会取消其他已选中的互斥答案
}

type AnswerType = "single_select" | "multi_select" | "auto_complete";
```

**关键字段解释:**

*   **`node_id`**: 每个节点的唯一ID，用于内部导航和在 `DialogAnswer` 中指定 `next_node_id`。
*   **`question_text`**: 当前节点向用户提出的问题。对于 `auto_complete` 类型，这可以是一个加载或处理中的提示。
*   **`answer_type`**:
    *   `"single_select"`: 用户只能选择一个答案。通常渲染为按钮列表或单选框组。
    *   `"multi_select"`: 用户可以选择多个答案。通常渲染为复选框列表。需要用户确认选择后才能继续。
    *   `"auto_complete"`: 节点会自动处理并前进到 `default_next_node_id` 或 `answers` 中定义的唯一 `next_node_id`。通常用于展示信息、执行异步操作（需要自行实现异步逻辑并调用 `handleSelection` 或导航到新节点）或逻辑分支。如果设置了 `autoCompleteDelay` 选项，则会在延迟后自动转换。
*   **`answers`**: 一个 `DialogAnswer` 数组。
    *   **`answer_id`**: 答案的唯一ID。
    *   **`answer_text`**: 显示给用户的答案文本。
    *   **`next_node_id`**: 选择此答案后跳转到的 `node_id`。如果为 `null`，则表示当前对话路径（或分支）结束。Hook 会尝试处理多选栈中的其他分支，或者结束整个对话。
    *   **`plan_trigger`**: 一个字符串标识，当用户选择此答案时，此标识会被收集。可用于后续生成推荐、总结等。
    *   **`execute_by_config_order`** (在 `DialogNode`): 仅用于 `multi_select`。若为 `true`，确认多选后，会严格按照 `answers` 数组中**已选项**的原始顺序依次进入分支。若为 `false` (默认)，则按 `execution_order` (在 `DialogAnswer` 中定义) 处理分支，若未定义 `execution_order`，则按用户选择的顺序。
    *   **`execution_order`** (在 `DialogAnswer`): 仅用于 `multi_select` 且父节点 `execute_by_config_order` 为 `false`。定义分支处理的优先级，数字越小优先级越高。
    *   **`mutually_exclusive`** (在 `DialogAnswer`): 仅用于 `multi_select`。如果一个答案标记为 `mutually_exclusive: true`，当用户选择它时，之前已选择的其他同样标记为 `mutually_exclusive: true` 的答案会被自动取消选中。这对于创建"以上都不是"或互斥的选项组很有用。
*   **`default_next_node_id` / `default_plan_trigger`**: 主要用于 `auto_complete` 节点，当节点自动完成时，会导航到 `default_next_node_id` 并触发 `default_plan_trigger`。如果 `answers` 数组中也有定义，通常 `answers` 中的配置会优先（取决于 `auto_complete` 的具体实现逻辑，一般 `answers` 是为 `auto_complete` 提供一个确定的路径）。

### 2. 使用 `useDialog` Hook

```tsx
const {
  currentNode,
  history,
  learningPlan, // 通常在对话结束后或特定节点处理后才有累积值
  selectedAnswers,
  handleSelection,
  handleMultiSelect,
  confirmSelections,
  resetDialog,
  // 还有 multiSelectBranchStack, currentBranchIndices, pendingPlanTriggers (高级)
} = useDialog(dialogData, options);
```

**核心返回值与函数：**

*   **`currentNode: DialogNode | null`**: 当前需要用户响应的对话节点。如果为 `null`，表示整个对话流程已完成。
*   **`history: HistoryItem[]`**: 一个数组，记录了用户与对话的交互历史。每个 `HistoryItem` 通常包含所提问的问题、用户的回答等。
    ```typescript
    interface HistoryItem {
      nodeId: string;         // 对应 DialogNode 的 ID，或特殊值如 'SYSTEM_LEARNING_PLAN'
      question: string;       // 当前节点的问题文本
      answer: string | null;  // 用户选择的答案文本 (对于多选，可能是合并后的文本或特定表示)
      answerId: string;       // 用户选择的答案 ID (对于多选，可能是触发确认的 ID 或特殊值)
      multiSelected?: string[];// 如果是多选，这里会包含所有选中的 answer_id
      type?: 'message' | 'learning_plan'; // 历史项类型，默认为 'message'
      planData?: string[];     // 如果 type 是 'learning_plan'，这里会包含具体的计划内容
    }
    ```
*   **`learningPlan: string[]`**: 一个字符串数组，收集了所有通过 `plan_trigger` 触发的计划。**注意**: 在 `useDialog` 的实现中，`learningPlan` 状态本身可能不会直接累积所有 `plan_trigger`。`pendingPlanTriggers` 会在对话过程中收集，并在对话结束或特定条件下通过 `finalizeDialogFlow` (内部函数) 处理，并可能将结果作为一个特殊的 `HistoryItem` (type: `learning_plan`) 添加到 `history` 中。因此，你通常会从 `history` 中筛选 `type === 'learning_plan'` 的项来获取最终的计划数据。
*   **`selectedAnswers: string[]`**: 仅在当前节点 `answer_type` 为 `multi_select` 时有意义。它是一个包含用户当前已勾选答案的 `answer_id` 的数组。
*   **`handleSelection(answerId: string): void`**:
    *   用于 `single_select` 类型：当用户选择一个答案时调用此函数，传入所选答案的 `answer_id`。
    *   也可用于 `auto_complete` 类型（如果需要手动触发）：如果你在 `auto_complete` 节点上显示了某个选项并希望用户点击后前进，可以调用此函数。
*   **`handleMultiSelect(answerId: string): void`**: 用于 `multi_select` 类型。当用户勾选或取消勾选一个答案时调用，传入相应答案的 `answer_id`。它会更新 `selectedAnswers` 数组。
*   **`confirmSelections(): void`**: 用于 `multi_select` 类型。当用户完成选择并点击确认按钮时调用。这将处理选中的答案，并根据 `next_node_id` 和 `execution_order` / `execute_by_config_order` 导航到后续节点或分支。
*   **`resetDialog(): void`**: 重置整个对话状态，回到初始节点，清空历史记录和所有收集的计划。

### 3. 渲染 UI 和处理交互

```tsx
function MyDialogComponent() {
  const { /* ... destructured values ... */ } = useDialog(dialogData);

  if (!currentNode) {
    // 对话结束
    return (
      <div>
        <h2>对话完成!</h2>
        <button onClick={resetDialog}>重新开始</button>
        <h3>历史记录:</h3>
        {history.map((item, index) => (
          <div key={index}>
            <p>Q: {item.question}</p>
            {item.answer && <p>A: {item.answer}</p>}
            {item.type === 'learning_plan' && item.planData && (
              <div>
                <h4>建议计划:</h4>
                <ul>{item.planData.map(p => <li key={p}>{p}</li>)}</ul>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h3>{currentNode.question_text}</h3>
      {currentNode.answer_type === 'single_select' && (
        currentNode.answers.map(answer => (
          <button key={answer.answer_id} onClick={() => handleSelection(answer.answer_id)}>
            {answer.answer_text}
          </button>
        ))
      )}

      {currentNode.answer_type === 'multi_select' && (
        <>
          {currentNode.answers.map(answer => (
            <label key={answer.answer_id}>
              <input
                type="checkbox"
                checked={selectedAnswers.includes(answer.answer_id)}
                onChange={() => handleMultiSelect(answer.answer_id)}
              />
              {answer.answer_text}
            </label>
          ))}
          <button onClick={confirmSelections} disabled={selectedAnswers.length === 0}>
            确认
          </button>
        </>
      )}

      {currentNode.answer_type === 'auto_complete' && (
        // 通常 auto_complete 会自动进行，但你也可以提供一个手动触发方式
        // 例如，如果 answers 数组中有内容，可以将其作为选项展示
        // 或者显示一个加载指示器
        <p>处理中，请稍候...</p>
        // 你可以在 useEffect 中监听 currentNode 的变化，
        // 如果是 auto_complete 类型且配置了 autoCompleteDelay，它会自动前进
        // 或者，如果需要异步操作，在这里执行，完成后手动调用 handleSelection(answer.answer_id)
        // (其中 answer.answer_id 指向 auto_complete 节点的 answers 数组中定义的那个答案)
        // 或直接操作内部导航（不推荐，应通过 hook 方法）
      )}
    </div>
  );
}
```

### 4. 选项 (`UseDialogOptions`)

关于 UseDialogOptions 的详细说明...

### 5. 事件 (`SCROLL_TO_BOTTOM_EVENT`)

关于 SCROLL_TO_BOTTOM_EVENT 事件的详细说明...

```

</rewritten_file>