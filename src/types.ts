/**
 * 对话系统类型定义
 */

// 定义答案选项的类型
export interface DialogAnswer {
  answer_id: string;
  answer_text: string;
  next_node_id: string | null;
  plan_trigger: string | null;
  execution_order?: number;
  mutually_exclusive?: boolean;
}

// 定义答案类型枚举
export type AnswerType = "single_select" | "multi_select" | "auto_complete";

// 定义对话节点的类型
export interface DialogNode {
  node_id: string;
  question_text: string; // 对于 auto_complete 类型，文本用于显示短暂的加载/处理消息
  answer_type: AnswerType;
  answers: DialogAnswer[]; // 对于 auto_complete 类型, 期望只有一个 answer 用于指定 next_node_id
  default_next_node_id?: string | null; // 新增：用于 auto_complete 类型的默认下一节点
  default_plan_trigger?: string | null; // 新增：用于 auto_complete 类型的默认计划触发器
  execute_by_config_order?: boolean;
  is_branch_end?: boolean;
}

// 定义历史记录项的类型
export interface HistoryItem {
  nodeId: string; // 对于 learning_plan 类型，可以是特殊标识符如 'SYSTEM_LEARNING_PLAN'
  question: string; // 对于 learning_plan 类型，可以是标题或提示，如 "学习计划建议"
  answer: string | null; // 对于 learning_plan 类型，可以为 null
  answerId: string; // 对于 learning_plan 类型，可以是特殊标识符如 'lp_summary'
  multiSelected?: string[];
  type?: 'message' | 'learning_plan'; // 默认为 'message'
  planData?: string[]; // 仅当 type 为 'learning_plan' 时使用
}

// 定义多选分支的类型
export interface SelectionBranch {
  answer_id: string;
  next_node_id: string;
  plan_trigger: string | null;
}

// 定义 Hook 配置选项
export interface UseDialogOptions {
  /** 初始节点 ID，如果不提供则使用数据源的第一个节点 */
  initialNodeId?: string;
  /** 自定义节点查找函数 */
  findNodeById?: (nodeId: string) => DialogNode | null;
  /** 自动完成节点的延迟时间（毫秒） */
  autoCompleteDelay?: number;
}

// 定义 Hook 返回值类型
export interface UseDialogReturn {
  /** 当前显示的对话节点 */
  currentNode: DialogNode | null;
  /** 用户的对话历史记录 */
  history: HistoryItem[];
  /** 收集到的学习计划触发器列表 */
  learningPlan: string[];
  /** 在多选模式下，当前用户勾选的答案ID列表 */
  selectedAnswers: string[];
  /** 管理嵌套多选分支的栈 */
  multiSelectBranchStack: SelectionBranch[][];
  /** 对应 multiSelectBranchStack 中每个层级当前已处理到的分支索引的栈 */
  currentBranchIndices: number[];
  /** 在对话流程结束前，临时收集的所有计划触发器 */
  pendingPlanTriggers: string[];
  /** 处理单选答案选择 */
  handleSelection: (answerId: string) => void;
  /** 处理多选答案勾选/取消勾选 */
  handleMultiSelect: (answerId: string) => void;
  /** 用户在多选模式下确认选择后调用 */
  confirmSelections: () => void;
  /** 重置整个对话状态到初始状态 */
  resetDialog: () => void;
} 