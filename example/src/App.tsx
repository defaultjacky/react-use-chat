import React, { useCallback, useEffect, useRef } from 'react';
import { useDialog, SCROLL_TO_BOTTOM_EVENT } from 'react-use-chat';
import { exampleDialogData } from './dialogData.ts';
import './App.css';

function App() {
  const {
    currentNode,
    history,
    selectedAnswers,
    handleSelection,
    handleMultiSelect,
    confirmSelections,
    resetDialog,
  } = useDialog(exampleDialogData, {
    initialNodeId: 'initialize_subject_entry',
    findNodeById: useCallback((nodeId: string) => {
      return exampleDialogData.find(node => node.node_id === nodeId) || null;
    }, []),
    // autoCompleteDelay: 1000
  });

  const messagesHistoryRef = useRef<HTMLDivElement>(null);

  // 监听滚动事件
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesHistoryRef.current) {
        messagesHistoryRef.current.scrollTop = messagesHistoryRef.current.scrollHeight;
      }
    };

    // 初始加载和每次 history 或 currentNode 更新后滚动
    scrollToBottom(); 

    const handleScrollEvent = () => {
      console.log('SCROLL_TO_BOTTOM_EVENT received by App.tsx');
      scrollToBottom();
    };

    document.addEventListener(SCROLL_TO_BOTTOM_EVENT, handleScrollEvent);
    return () => {
      document.removeEventListener(SCROLL_TO_BOTTOM_EVENT, handleScrollEvent);
    };
  }, [history, currentNode]); // 依赖 history 和 currentNode 确保内容更新后滚动

  const renderHistoryItem = (item: any, index: number) => {
    if (item.type === 'learning_plan') {
      return (
        <div key={index} className="message system-message">
          <div className="message-content">
            <h3>{item.question}</h3>
            <ul className="plan-list">
              {item.planData?.map((plan: string, planIndex: number) => (
                <li key={planIndex} className="plan-item">{plan}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="message-pair">
        <div className="message question-message">
          <div className="message-content">{item.question}</div>
        </div>
        {
          item.answer && (
            <div className="message answer-message">
              <div className="message-content">{item.answer}</div>
            </div>
          )
        }
      </div>
    );
  };

  const renderCurrentNode = () => {
    if (!currentNode) {
      return (
        <div className="dialog-complete">
          <h2>对话已完成</h2>
          <button onClick={resetDialog} className="btn btn-primary">重新开始</button>
        </div>
      );
    }

    return (
      <div className="current-question">
        <div className="message question-message">
          <div className="message-content">{currentNode.question_text}</div>
        </div>
        
        {currentNode.answer_type === 'single_select' && (
          <div className="answers-container">
            {currentNode.answers.map((answer) => (
              <button
                key={answer.answer_id}
                onClick={() => handleSelection(answer.answer_id)}
                className="btn btn-answer"
              >
                {answer.answer_text}
              </button>
            ))}
          </div>
        )}

        {currentNode.answer_type === 'multi_select' && (
          <div className="answers-container">
            {currentNode.answers.map((answer) => (
              <label key={answer.answer_id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedAnswers.includes(answer.answer_id)}
                  onChange={() => handleMultiSelect(answer.answer_id)}
                />
                <span className="checkbox-text">{answer.answer_text}</span>
              </label>
            ))}
            
            {selectedAnswers.length > 0 && (
              <button
                onClick={confirmSelections}
                className="btn btn-primary confirm-btn"
              >
                确认选择 ({selectedAnswers.length})
              </button>
            )}
          </div>
        )}

        {currentNode.answer_type === 'auto_complete' && (
          <div className="auto-complete-indicator">
            <div className="loading-spinner"></div>
            <span>处理中...</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <main className="app-main">
        <div className="dialog-container">
          <div className="messages-history" ref={messagesHistoryRef}>
            {history.map(renderHistoryItem)}
          </div>
          
          {renderCurrentNode()}
        </div>

        <div className="controls">
          <button onClick={resetDialog} className="btn btn-secondary">
            Reset the chat
          </button>
        </div>
      </main>
    </div>
  );
}

export default App; 

