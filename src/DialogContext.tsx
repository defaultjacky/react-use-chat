import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { DialogNode, DialogAnswer, HistoryItem, SelectionBranch } from './types';

// 定义滚动事件的名称
export const SCROLL_TO_BOTTOM_EVENT = 'scrollToBottom';

/**
 * @interface DialogContextType
 * @description 对话上下文的状态和操作方法定义
 * @property {DialogNode | null} currentNode - 当前显示的对话节点
 * @property {HistoryItem[]} history - 用户的对话历史记录
 * @property {string[]} learningPlan - 收集到的学习计划触发器列表
 * @property {string[]} selectedAnswers - 在多选模式下，当前用户勾选的答案ID列表
 * @property {SelectionBranch[][]} multiSelectBranchStack - 管理嵌套多选分支的栈，每个元素是当前层级的待处理分支数组
 * @property {number[]} currentBranchIndices - 对应 multiSelectBranchStack 中每个层级当前已处理到的分支索引的栈
 * @property {string[]} pendingPlanTriggers - 在对话流程结束前，临时收集的所有计划触发器
 * @property {(answerId: string) => void} handleSelection - 处理单选答案选择的函数
 * @property {(answerId: string) => void} handleMultiSelect - 处理多选答案勾选/取消勾选的函数
 * @property {() => void} confirmSelections - 用户在多选模式下确认选择后调用的函数
 * @property {() => void} resetDialog - 重置整个对话状态到初始状态的函数
 */
export interface DialogContextType {
  currentNode: DialogNode | null;
  history: HistoryItem[];
  learningPlan: string[];
  selectedAnswers: string[];
  multiSelectBranchStack: SelectionBranch[][];
  currentBranchIndices: number[];
  pendingPlanTriggers: string[];
  handleSelection: (answerId: string) => void;
  handleMultiSelect: (answerId: string) => void;
  confirmSelections: () => void;
  resetDialog: () => void;
}

// 创建 context 并提供默认值
const DialogContext = createContext<DialogContextType>({
  currentNode: null,
  history: [],
  learningPlan: [],
  selectedAnswers: [],
  multiSelectBranchStack: [],
  currentBranchIndices: [],
  pendingPlanTriggers: [],
  handleSelection: () => {},
  handleMultiSelect: () => {},
  confirmSelections: () => {},
  resetDialog: () => {}
});

/**
 * @hook useDialog
 * @description 自定义 Hook，用于方便地访问对话上下文。
 * @returns {DialogContextType} 对话上下文对象
 */
export const useDialog = () => useContext(DialogContext);

/**
 * @component DialogProvider
 * @description 对话状态管理和逻辑处理的核心组件。
 *              使用 React Context API 向其子组件提供对话状态和操作方法。
 * @param {object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @param {DialogNode[]} props.dialogData - 对话节点数据
 */
export const DialogProvider: React.FC<{ 
  children: React.ReactNode; 
  dialogData: DialogNode[];
}> = ({ children, dialogData }) => {
  const [currentNode, setCurrentNode] = useState<DialogNode | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [learningPlan, setLearningPlan] = useState<string[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [multiSelectBranchStack, setMultiSelectBranchStack] = useState<SelectionBranch[][]>([]);
  const [currentBranchIndices, setCurrentBranchIndices] = useState<number[]>([]);
  const [pendingPlanTriggers, setPendingPlanTriggers] = useState<string[]>([]);
  const [shouldFinalizePlans, setShouldFinalizePlans] = useState(false);
  
  // Refs 用于在回调函数中保存状态的当前值，避免因闭包问题导致回调函数重触发
  const currentNodeRef = useRef<DialogNode | null>(currentNode);
  useEffect(() => { currentNodeRef.current = currentNode; }, [currentNode]);

  const multiSelectBranchStackRef = useRef<SelectionBranch[][]>(multiSelectBranchStack);
  useEffect(() => { multiSelectBranchStackRef.current = multiSelectBranchStack; }, [multiSelectBranchStack]);

  const currentBranchIndicesRef = useRef<number[]>(currentBranchIndices);
  useEffect(() => { currentBranchIndicesRef.current = currentBranchIndices; }, [currentBranchIndices]);

  const learningPlanRef = useRef(learningPlan);
  useEffect(() => { learningPlanRef.current = learningPlan; }, [learningPlan]);

  const pendingPlanTriggersRef = useRef(pendingPlanTriggers);
  useEffect(() => { pendingPlanTriggersRef.current = pendingPlanTriggers; }, [pendingPlanTriggers]);

  /**
   * @function findNodeById
   * @description 根据节点ID从对话数据中查找节点。
   * @param {string} nodeId - 要查找的节点ID。
   * @returns {DialogNode | null} 找到的节点对象，如果未找到则返回 null。
   */
  const findNodeById = useCallback((nodeId: string): DialogNode | null => {
    return dialogData.find(node => node.node_id === nodeId) || null;
  }, [dialogData]);

  /**
   * @function determineIfEndNode
   * @description 判断一个节点是否为结束节点（显式标记或无答案）。
   * @param {DialogNode} node - 需要判断的节点。
   * @returns {boolean} 如果是结束节点则为 true，否则为 false。
   */
  const determineIfEndNode = useCallback((node: DialogNode): boolean => {
    if (node.is_branch_end) return true;
    if (!node.answers || node.answers.length === 0) return true; 
    return false;
  }, []);

  /**
   * @function handlePlanTrigger
   * @description 处理并收集学习计划触发器。
   *              将触发器添加至 pendingPlanTriggers 列表，确保不重复添加。
   * @param {string | null} trigger - 计划触发器的标识符。
   */
  const handlePlanTrigger = useCallback((trigger: string | null) => {
    if (!trigger) return;
    setPendingPlanTriggers(prev => {
      if (!prev.includes(trigger)) {
        return [...prev, trigger];
      }
      return prev;
    });
  }, []);

  const proceedToNextBranchOrFinalize = useCallback(() => {
    if (multiSelectBranchStackRef.current.length === 0) {
      setShouldFinalizePlans(true);
      return;
    }

    let newStack = [...multiSelectBranchStackRef.current];
    let newIndices = [...currentBranchIndicesRef.current];

    while (newStack.length > 0) {
      const currentLevelBranches = newStack[newStack.length - 1];
      const currentLevelProcessedIndex = newIndices[newIndices.length - 1];
      const nextBranchIndexToTry = currentLevelProcessedIndex + 1;

      if (nextBranchIndexToTry < currentLevelBranches.length) {
        newIndices[newIndices.length - 1] = nextBranchIndexToTry;
        setMultiSelectBranchStack(newStack); 
        setCurrentBranchIndices(newIndices);

        const nextBranch = currentLevelBranches[nextBranchIndexToTry];
        navigateToNodeAndHandleBranchTrigger(nextBranch.next_node_id, nextBranch.plan_trigger);
        return;
      } else {
        newStack.pop();
        newIndices.pop();
      }
    }
    setMultiSelectBranchStack([]);
    setCurrentBranchIndices([]);
    setShouldFinalizePlans(true);
  }, []);

  /**
   * @function navigateToNode
   * @description 导航到指定的对话节点。如果节点ID无效或为空，则尝试处理下一分支或结束对话。
   * @param {string | null | undefined} nodeId - 目标节点的ID。
   */
  const navigateToNode = useCallback((nodeId: string | null | undefined) => {
    if (!nodeId) {
      proceedToNextBranchOrFinalize();
      return;
    }
    const node = findNodeById(nodeId);
    if (node) {
      setCurrentNode(node);
    } else {
      console.warn(`无效的 next_node_id '${nodeId}'。尝试继续或结束流程。`);
      proceedToNextBranchOrFinalize();
    }
  }, [findNodeById, proceedToNextBranchOrFinalize]);

  /**
   * @function navigateToNodeAndHandleBranchTrigger
   * @description 导航到指定节点，并在导航前处理该分支可能带有的计划触发器。
   * @param {string | null | undefined} nodeId - 目标节点的ID。
   * @param {string | null} [branchTrigger] - (可选) 该分支的计划触发器。
   */
  const navigateToNodeAndHandleBranchTrigger = useCallback((nodeId: string | null | undefined, branchTrigger?: string | null) => {
    if (branchTrigger) {
      handlePlanTrigger(branchTrigger);
    }
    navigateToNode(nodeId);
  }, [handlePlanTrigger, navigateToNode]);

  /**
   * @function processDialogTransition
   * @description 根据用户选择的答案，处理对话的转换逻辑。
   *              如果答案指向下一个节点，则导航到该节点。
   *              如果当前路径结束（无下一节点或当前节点是分支末端），则尝试进入多选栈的下一分支或结束对话。
   * @param {DialogAnswer} selectedAnswer - 用户选择的答案对象。
   */
  const processDialogTransition = useCallback((selectedAnswer: DialogAnswer) => {
    const hasNextNodeId = !!selectedAnswer.next_node_id;
    const isCurrentNodeItselfAnEndNode = currentNodeRef.current ? determineIfEndNode(currentNodeRef.current) : false;

    if (!hasNextNodeId || isCurrentNodeItselfAnEndNode) {
      proceedToNextBranchOrFinalize();
    } else {
      navigateToNode(selectedAnswer.next_node_id);
    }
  }, [navigateToNode, proceedToNextBranchOrFinalize, determineIfEndNode]);

  /**
   * @function finalizeDialogFlow
   * @description 最终确定对话流程。将所有待处理的计划触发器合并到最终的学习计划中，
   *              并清空多选分支栈、索引、待处理触发器等临时状态。
   */
  const finalizeDialogFlow = useCallback(() => {
    console.log("finalizeDialogFlow: 合并学习计划，将其作为历史记录项添加，并准备启动下一轮对话。");
    
    const finalizedLearningPlan = [...new Set([...learningPlanRef.current, ...pendingPlanTriggersRef.current])];

    if (finalizedLearningPlan.length > 0) {
      const learningPlanHistoryItem: HistoryItem = {
        nodeId: 'SYSTEM_LEARNING_PLAN',
        question: '给你的学习建议：',
        answer: null,
        answerId: `lp_${Date.now()}`,
        type: 'learning_plan',
        planData: finalizedLearningPlan
      };
      setHistory(prevHistory => [...prevHistory, learningPlanHistoryItem]);
    }
    
    setLearningPlan([]);
    setPendingPlanTriggers([]);
    setMultiSelectBranchStack([]);
    setCurrentBranchIndices([]);

    // 寻找下一个对话流程的起始节点
    const nextDialogStartNode = findNodeById('end_subject_entry');
    if (nextDialogStartNode) {
      setCurrentNode(nextDialogStartNode);
      setSelectedAnswers([]); 
      setShouldFinalizePlans(false); 
    } else {
      console.warn("无法找到ID为 'end_subject_entry' 的节点，对话将在此结束。");
      setCurrentNode(null); 
      setShouldFinalizePlans(false); 
    }
  }, [findNodeById]);

  // --- 生命周期 Effect --- //

  /**
   * Effect: 初始化对话，加载 dialogData 中的第一个节点。
   */
  useEffect(() => {
    const initialNode = dialogData[0];
    if (initialNode) {
        setCurrentNode(initialNode as DialogNode);
    }
  }, [dialogData]);

  /**
   * Effect: 当 `shouldFinalizePlans` 为 true 时，最终确定对话流程。
   */
  useEffect(() => {
    if (shouldFinalizePlans) {
      finalizeDialogFlow();
    }
  }, [shouldFinalizePlans, finalizeDialogFlow]);
  
  /**
   * Effect: 自动处理 'auto_complete' 类型的节点。
   */
  useEffect(() => {
    if (currentNode?.answer_type === 'auto_complete') {
      if (currentNode.default_next_node_id) {
        const timerId = setTimeout(() => {
          if (
            currentNodeRef.current?.node_id === currentNode.node_id &&
            currentNodeRef.current?.answer_type === 'auto_complete'
          ) {
            setHistory(prev => [...prev, {
              nodeId: currentNode.node_id,
              question: currentNode.question_text || "自动处理中...",
              answer: null,
              answerId: `auto_default_for_${currentNode.node_id}`
            }]);
            
            if (typeof document !== 'undefined') {
              document.dispatchEvent(new Event(SCROLL_TO_BOTTOM_EVENT));
            }

            if (currentNode.default_plan_trigger) {
              handlePlanTrigger(currentNode.default_plan_trigger);
            }
            navigateToNode(currentNode.default_next_node_id);
          }
        }, 0);
        return () => clearTimeout(timerId);
      } else {
        console.warn(
          `警告：类型为 'auto_complete' 的节点 '${currentNode.node_id}' 缺少 'default_next_node_id'。尝试继续或结束流程。`
        );
        proceedToNextBranchOrFinalize();
      }
    }
  }, [currentNode, handlePlanTrigger, navigateToNode, proceedToNextBranchOrFinalize]);
  
  /**
   * @function handleSelection
   * @description 处理用户单选一个答案的逻辑。
   */
  const handleSelection = useCallback((answerId: string) => {
    if (!currentNodeRef.current) return;
    
    const selectedAnswer = currentNodeRef.current.answers.find(ans => ans.answer_id === answerId);
    
    if (!selectedAnswer) {
      console.warn(`在当前节点 '${currentNodeRef.current.node_id}' 中未找到选定的 answerId '${answerId}'。`);
      return;
    }
        
    setHistory(prev => [...prev, {
      nodeId: currentNodeRef.current!.node_id,
      question: currentNodeRef.current!.question_text,
      answer: selectedAnswer.answer_text,
      answerId: selectedAnswer.answer_id
    }]);
    
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new Event(SCROLL_TO_BOTTOM_EVENT));
    }
    
    if (selectedAnswer.plan_trigger) {
      handlePlanTrigger(selectedAnswer.plan_trigger);
    }
    
    processDialogTransition(selectedAnswer);
  }, [handlePlanTrigger, processDialogTransition]);

  /**
   * @function handleMutuallyExclusiveSelection
   * @description 处理多选答案中的互斥逻辑。
   */
  const handleMutuallyExclusiveSelection = useCallback((
    currentNodeForSelection: DialogNode,
    toggledAnswerId: string,
    currentSelections: string[]
  ): string[] => {
    const toggledAnswer = currentNodeForSelection.answers.find(ans => ans.answer_id === toggledAnswerId);
    if (!toggledAnswer) return currentSelections;
    
    const isToggledAnswerME = toggledAnswer.mutually_exclusive === true;
    
    if (isToggledAnswerME) {
      return currentSelections.includes(toggledAnswerId) ? [] : [toggledAnswerId];
    } else {
      const anMEIsSelected = currentSelections.some(id => {
        if (id === toggledAnswerId) return false;
        const ans = currentNodeForSelection.answers.find(a => a.answer_id === id);
        return ans?.mutually_exclusive === true;
      });
      
      if (anMEIsSelected) {
        return [toggledAnswerId];
      } else {
        return currentSelections.includes(toggledAnswerId)
          ? currentSelections.filter(id => id !== toggledAnswerId)
          : [...currentSelections, toggledAnswerId];
      }
    }
  }, []);

  /**
   * @function handleMultiSelect
   * @description 处理用户在多选模式下勾选或取消勾选一个答案。
   */
  const handleMultiSelect = useCallback((answerId: string) => {
    if (!currentNodeRef.current || currentNodeRef.current.answer_type !== 'multi_select') return;
    
    setSelectedAnswers(prev => {
      return handleMutuallyExclusiveSelection(currentNodeRef.current!, answerId, prev);
    });
  }, [handleMutuallyExclusiveSelection]);

  /**
   * @function confirmSelections
   * @description 处理用户在多选模式下点击"确认"按钮的逻辑。
   */
  const confirmSelections = useCallback(() => {
    if (!currentNodeRef.current || selectedAnswers.length === 0) return;
    
    const nodeForConfirm = currentNodeRef.current;

    const selectedAnswerObjects = nodeForConfirm.answers.filter(
      ans => selectedAnswers.includes(ans.answer_id)
    );
    
    selectedAnswerObjects.forEach(ansObj => {
      if (ansObj.plan_trigger) {
        handlePlanTrigger(ansObj.plan_trigger);
      }
    });
        
    const combinedAnswerText = selectedAnswerObjects
      .map(ans => ans.answer_text)
      .join(', ');
    
    setHistory(prev => [...prev, {
      nodeId: nodeForConfirm.node_id,
      question: nodeForConfirm.question_text,
      answer: combinedAnswerText,
      answerId: selectedAnswers.join(','),
      multiSelected: [...selectedAnswers]
    }]);
    
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new Event(SCROLL_TO_BOTTOM_EVENT));
    }
    
    const createBranchesWithOrder = (): (SelectionBranch & { execution_order: number })[] => {
      return selectedAnswers
        .map(answerId => {
          const answer = nodeForConfirm.answers.find(ans => ans.answer_id === answerId);
          if (!answer || !answer.next_node_id) return null;
          
          return {
            answer_id: answerId,
            next_node_id: answer.next_node_id,
            plan_trigger: answer.plan_trigger,
            execution_order: answer.execution_order || 0
          };
        })
        .filter(branch => branch !== null) as (SelectionBranch & { execution_order: number })[];
    };
    
    let branchesWithOrder = createBranchesWithOrder();
    
    const shouldExecuteByConfigOrder = !!nodeForConfirm.execute_by_config_order;
    if (shouldExecuteByConfigOrder && branchesWithOrder.length > 0) {
      branchesWithOrder.sort((a, b) => a.execution_order - b.execution_order);
    }
    
    const finalBranches: SelectionBranch[] = branchesWithOrder.map(({ execution_order, ...rest }) => rest);
    
    if (finalBranches.length > 0) {
      setMultiSelectBranchStack(prevStack => [...prevStack, finalBranches]);
      setCurrentBranchIndices(prevIndices => [...prevIndices, 0]);
      setSelectedAnswers([]);

      const firstBranchOfNewLevel = finalBranches[0];
      navigateToNodeAndHandleBranchTrigger(firstBranchOfNewLevel.next_node_id, firstBranchOfNewLevel.plan_trigger);
    } else {
      setSelectedAnswers([]);
      proceedToNextBranchOrFinalize();
    }
  }, [selectedAnswers, handlePlanTrigger, navigateToNodeAndHandleBranchTrigger, proceedToNextBranchOrFinalize]);

  /**
   * @function resetDialog
   * @description 重置整个对话状态到其初始值。
   */
  const resetDialog = useCallback(() => {
    const initialNode = dialogData[0] as DialogNode;
    setCurrentNode(initialNode);
    setHistory([]);
    setLearningPlan([]);
    setSelectedAnswers([]);
    setMultiSelectBranchStack([]);
    setCurrentBranchIndices([]);
    setPendingPlanTriggers([]);
    setShouldFinalizePlans(false);
    console.log("对话已重置到初始状态。");
  }, [dialogData]);

  return (
    <DialogContext.Provider 
      value={{ 
        currentNode, 
        history, 
        learningPlan,
        selectedAnswers,
        multiSelectBranchStack,
        currentBranchIndices,
        pendingPlanTriggers,
        handleSelection,
        handleMultiSelect,
        confirmSelections,
        resetDialog
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}; 