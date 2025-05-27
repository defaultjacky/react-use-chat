import { renderHook, act } from '@testing-library/react';
import { useDialog } from '../useDialog';
import { DialogNode } from '../types';

// 测试数据
const mockDialogData: DialogNode[] = [
  {
    node_id: 'start',
    question_text: '欢迎！请选择你想学习的内容：',
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
    question_text: '你的数学水平如何？',
    answer_type: 'multi_select',
    answers: [
      {
        answer_id: 'basic',
        answer_text: '基础',
        next_node_id: null,
        plan_trigger: '基础数学',
      },
      {
        answer_id: 'intermediate',
        answer_text: '中等',
        next_node_id: null,
        plan_trigger: '中等数学',
      },
    ],
  },
];

describe('useDialog Hook', () => {
  beforeEach(() => {
    // Mock document.dispatchEvent for SCROLL_TO_BOTTOM_EVENT
    global.document.dispatchEvent = jest.fn();
  });

  test('应该初始化为第一个节点', () => {
    const { result } = renderHook(() => useDialog(mockDialogData));
    
    expect(result.current.currentNode).toEqual(mockDialogData[0]);
    expect(result.current.history).toEqual([]);
  });

  test('应该处理单选选择', () => {
    const { result } = renderHook(() => useDialog(mockDialogData));
    
    act(() => {
      result.current.handleSelection('math');
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].answer).toBe('数学');
    expect(result.current.currentNode?.node_id).toBe('math_level');
  });

  test('应该处理多选选择', () => {
    const { result } = renderHook(() => useDialog(mockDialogData));
    
    // 先导航到多选节点
    act(() => {
      result.current.handleSelection('math');
    });

    // 测试多选
    act(() => {
      result.current.handleMultiSelect('basic');
    });

    expect(result.current.selectedAnswers).toContain('basic');

    act(() => {
      result.current.handleMultiSelect('intermediate');
    });

    expect(result.current.selectedAnswers).toContain('intermediate');
    expect(result.current.selectedAnswers).toHaveLength(2);
  });

  test('应该正确重置对话', () => {
    const { result } = renderHook(() => useDialog(mockDialogData));
    
    // 进行一些操作
    act(() => {
      result.current.handleSelection('math');
    });

    // 重置
    act(() => {
      result.current.resetDialog();
    });

    expect(result.current.currentNode).toEqual(mockDialogData[0]);
    expect(result.current.history).toEqual([]);
    expect(result.current.selectedAnswers).toEqual([]);
  });

  test('应该支持自定义初始节点', () => {
    const { result } = renderHook(() => 
      useDialog(mockDialogData, { initialNodeId: 'math_level' })
    );
    
    expect(result.current.currentNode?.node_id).toBe('math_level');
  });
}); 