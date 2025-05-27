// 导出主要的 Hook
export { useDialog, SCROLL_TO_BOTTOM_EVENT } from './useDialog';

// 导出所有类型定义
export type {
  DialogAnswer,
  AnswerType,
  DialogNode,
  HistoryItem,
  SelectionBranch,
  UseDialogOptions,
  UseDialogReturn
} from './types';

// 导出 Context 版本（向后兼容）
export { DialogProvider, useDialog as useDialogContext } from './DialogContext';
export type { DialogContextType } from './DialogContext'; 