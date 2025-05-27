# React Use Chat

[![npm version](https://badge.fury.io/js/react-use-chat.svg)](https://badge.fury.io/js/react-use-chat)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A React Hook for building conversational guide flows, supporting single-select, multi-select, and nested branch handling.

[中文](./README.md) | English

## ✨ Features

- 🎯 **Conversational Interaction** - Guide users through complex flows in a chat format.
- 🎛️ **Multiple Choice Types** - Supports single-select, multi-select, and auto-complete.
- 🌳 **Nested Branch Handling** - Supports complex dialogue trees with multiple levels of nesting.
- 🎨 **Flexible Configuration** - Supports custom execution order and mutually exclusive options.
- 📝 **History Record** - Automatically records user selection history.
- 🎁 **Plan Recommendation** - Generates personalized recommendations based on user selections.
- 📱 **Responsive** - Supports desktop and mobile.
- 🔧 **TypeScript** - Full TypeScript type definitions.
- 🪝 **React Hooks** - Modern React development pattern.
- ⚡ **Lightweight** - No extra dependencies, small footprint.

## 📦 Installation

```bash
npm install react-use-chat
```

```bash
yarn add react-use-chat
```

```bash
pnpm add react-use-chat
```

## 🚀 Quick Start

### Basic Usage

```tsx
import React from 'react';
import { useDialog, DialogNode } from 'react-use-chat'; // Assuming DialogNode is exported

const dialogData: DialogNode[] = [
  {
    node_id: 'welcome',
    question_text: 'What do you want to learn?',
    answer_type: 'single_select',
    answers: [
      {
        answer_id: 'math',
        answer_text: 'Mathematics',
        next_node_id: 'math_level',
        plan_trigger: null,
      },
      {
        answer_id: 'english',
        answer_text: 'English',
        next_node_id: null,
        plan_trigger: 'English Learning Plan',
      },
    ],
  },
  {
    node_id: 'math_level',
    question_text: 'Choose your math level:',
    answer_type: 'multi_select',
    answers: [
      {
        answer_id: 'basic',
        answer_text: 'Basic',
        next_node_id: null,
        plan_trigger: 'Basic Mathematics',
      },
      {
        answer_id: 'advanced',
        answer_text: 'Advanced',
        next_node_id: null,
        plan_trigger: 'Advanced Mathematics',
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
    return <div>Dialog finished.</div>;
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
            Confirm Selection
          </button>
        </div>
      )}
    </div>
  );
}
```

### Using Context Provider (Optional)

For complex applications, you can also use the Context Provider pattern:

```tsx
import React from 'react';
import { DialogProvider, useDialogContext, DialogNode } from 'react-use-chat';

// Assume dialogData is defined as: const dialogData: DialogNode[] = [ ... ];
declare const dialogData: DialogNode[];


function DialogComponent() {
  const { currentNode, handleSelection /* ... other context values ... */ } = useDialogContext();
  // ... component logic
  if (!currentNode) return <p>Dialog finished.</p>;
  return (
    <div>
      <h2>{currentNode.question_text}</h2>
      {/* Render answers based on currentNode.answer_type */}
    </div>
  );
}

function App() {
  return (
    <DialogProvider dialogData={dialogData}>
      <DialogComponent />
    </DialogProvider>
  );
}
```

## ⚙️ Core Concepts and Detailed Usage

The core of `react-use-chat` is the `useDialog` Hook, which accepts dialog data and optional configurations, and returns the state and functions needed to manage the dialog flow.

### 1. Dialog Data Structure (`DialogNode[]`)

Dialog data is an array of `DialogNode` objects. Each `DialogNode` represents a step or question in the dialog.

```typescript
interface DialogNode {
  node_id: string;                    // Unique identifier for the node, used for navigation
  question_text: string;              // The question or information displayed to the user at this node
  answer_type: AnswerType;            // Answer type: "single_select" | "multi_select" | "auto_complete"
  answers: DialogAnswer[];            // Array of answer options
  default_next_node_id?: string | null; // (Optional) Mainly for 'auto_complete' type, automatically transitions to the next node without specific answer interaction
  default_plan_trigger?: string | null; // (Optional) Mainly for 'auto_complete' type, an automatically triggered plan
  execute_by_config_order?: boolean;  // (Optional, for multi_select only) If true, after multi-select confirmation, branches for selected items will be processed strictly in the order they appear in the 'answers' array
  is_branch_end?: boolean;            // (Optional) Marks if this node is a logical end of a branch, even if it has a next_node_id
}

interface DialogAnswer {
  answer_id: string;           // Unique identifier for the answer
  answer_text: string;         // The answer text displayed to the user
  next_node_id: string | null; // The next_node_id to jump to if this answer is selected. If null, it means the current path ends
  plan_trigger: string | null; // (Optional) A plan/tag triggered if this answer is selected, collected into the learningPlan array
  execution_order?: number;    // (Optional, for multi_select when execute_by_config_order is false) Defines the processing priority of multi-select branches, smaller numbers have higher priority
  mutually_exclusive?: boolean; // (Optional, for multi_select only) If true, selecting this answer will deselect other mutually_exclusive answers
}

type AnswerType = "single_select" | "multi_select" | "auto_complete";
```

**Key Field Explanations:**

*   **`node_id`**: Unique ID for each node, used for internal navigation and specifying `next_node_id` in `DialogAnswer`.
*   **`question_text`**: The question posed to the user at the current node. For `auto_complete` type, this can be a loading or processing message.
*   **`answer_type`**:
    *   `"single_select"`: The user can only select one answer. Typically rendered as a list of buttons or radio button group.
    *   `"multi_select"`: The user can select multiple answers. Typically rendered as a list of checkboxes. Requires user confirmation to proceed.
    *   `"auto_complete"`: The node automatically processes and advances to `default_next_node_id` or the unique `next_node_id` defined in `answers`. Used for displaying information, performing asynchronous operations (you need to implement async logic yourself and then call `handleSelection` or navigate to a new node), or logical branching. If the `autoCompleteDelay` option is set, it will transition after a delay.
*   **`answers`**: An array of `DialogAnswer`.
    *   **`answer_id`**: Unique ID of the answer.
    *   **`answer_text`**: Answer text displayed to the user.
    *   **`next_node_id`**: The `node_id` to navigate to after selecting this answer. If `null`, it signifies the end of the current dialog path (or branch). The hook will then attempt to process other branches in the multi-select stack or end the entire dialog.
    *   **`plan_trigger`**: A string identifier. When the user selects this answer, this identifier is collected. Can be used for generating recommendations, summaries, etc.
    *   **`execute_by_config_order`** (on `DialogNode`): For `multi_select` only. If `true`, after confirming multiple selections, branches for **selected items** will be entered strictly in their original order in the `answers` array. If `false` (default), branches are processed by `execution_order` (defined in `DialogAnswer`), or by selection order if `execution_order` is not defined.
    *   **`execution_order`** (on `DialogAnswer`): For `multi_select` only and when the parent node's `execute_by_config_order` is `false`. Defines the branch processing priority; lower numbers have higher priority.
    *   **`mutually_exclusive`** (on `DialogAnswer`): For `multi_select` only. If an answer is marked `mutually_exclusive: true`, selecting it will automatically deselect other previously selected answers also marked `mutually_exclusive: true`. Useful for "none of the above" or mutually exclusive option groups.
*   **`default_next_node_id` / `default_plan_trigger`**: Primarily for `auto_complete` nodes. When the node auto-completes, it navigates to `default_next_node_id` and triggers `default_plan_trigger`. If also defined in the `answers` array, the `answers` configuration usually takes precedence (depends on the specific `auto_complete` logic, but `answers` typically provide a definite path for `auto_complete`).

### 2. Using the `useDialog` Hook

```tsx
const {
  currentNode,
  history,
  learningPlan, // Usually accumulates values after the dialog ends or at specific node processing
  selectedAnswers,
  handleSelection,
  handleMultiSelect,
  confirmSelections,
  resetDialog,
  // Also multiSelectBranchStack, currentBranchIndices, pendingPlanTriggers (Advanced)
} = useDialog(dialogData, options);
```

**Core Return Values and Functions:**

*   **`currentNode: DialogNode | null`**: The current dialog node requiring user response. If `null`, the entire dialog flow is complete.
*   **`history: HistoryItem[]`**: An array recording the user's interaction history with the dialog. Each `HistoryItem` typically contains the question asked, the user's answer, etc.
    ```typescript
    interface HistoryItem {
      nodeId: string;         // Corresponds to DialogNode's ID, or special values like 'SYSTEM_LEARNING_PLAN'
      question: string;       // Question text of the current node
      answer: string | null;  // User's selected answer text (for multi-select, might be a combined text or specific representation)
      answerId: string;       // User's selected answer ID (for multi-select, might be the ID that triggered confirmation or a special value)
      multiSelected?: string[];// If multi-select, this will contain all selected answer_ids
      type?: 'message' | 'learning_plan'; // History item type, defaults to 'message'
      planData?: string[];     // If type is 'learning_plan', this contains the specific plan content
    }
    ```
*   **`learningPlan: string[]`**: An array of strings, collecting all plans triggered via `plan_trigger`. **Note**: In the `useDialog` implementation, the `learningPlan` state itself might not directly accumulate all `plan_trigger`s. `pendingPlanTriggers` are collected during the dialog and processed by `finalizeDialogFlow` (internal function) at the end of the dialog or under certain conditions, possibly adding the result as a special `HistoryItem` (type: `learning_plan`) to `history`. Therefore, you'll typically filter items with `type === 'learning_plan'` from `history` to get the final plan data.
*   **`selectedAnswers: string[]`**: Meaningful only when the current node's `answer_type` is `multi_select`. It's an array of `answer_id`s for the answers currently checked by the user.
*   **`handleSelection(answerId: string): void`**:
    *   For `single_select` type: Call this function when the user selects an answer, passing the `answer_id` of the chosen answer.
    *   Can also be used for `auto_complete` type (if manual triggering is needed): If you display an option on an `auto_complete` node and want the user to click it to proceed, call this function.
*   **`handleMultiSelect(answerId: string): void`**: For `multi_select` type. Call when the user checks or unchecks an answer, passing the respective `answer_id`. It updates the `selectedAnswers` array.
*   **`confirmSelections(): void`**: For `multi_select` type. Call when the user has finished selecting and clicks a confirmation button. This will process the selected answers and navigate to subsequent nodes or branches based on `next_node_id` and `execution_order` / `execute_by_config_order`.
*   **`resetDialog(): void`**: Resets the entire dialog state to the initial node, clears history, and all collected plans.

### 3. Rendering UI and Handling Interactions

Based on the state returned by the `useDialog` Hook, you can build your user interface.

```tsx
import React, { useEffect, useRef } from 'react';
import { useDialog, SCROLL_TO_BOTTOM_EVENT, DialogNode, HistoryItem } from 'react-use-chat'; // Ensure necessary types are imported

// Assume dialogData is defined
declare const dialogData: DialogNode[];

function MyDialogComponent() {
  const {
    currentNode,
    history,
    selectedAnswers,
    handleSelection,
    handleMultiSelect,
    confirmSelections,
    resetDialog,
  } = useDialog(dialogData);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Handle scrolling
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    };
    scrollToBottom(); // Initial scroll
    document.addEventListener(SCROLL_TO_BOTTOM_EVENT, scrollToBottom);
    return () => {
      document.removeEventListener(SCROLL_TO_BOTTOM_EVENT, scrollToBottom);
    };
  }, [history, currentNode]); // Dependencies ensure scroll on content update

  if (!currentNode) {
    // Dialog finished
    return (
      <div>
        <h2>Dialog Complete!</h2>
        <button onClick={resetDialog}>Restart</button>
        <h3>History:</h3>
        <div ref={messagesContainerRef} style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {history.map((item: HistoryItem, index: number) => (
            <div key={index} style={{ borderBottom: '1px solid #eee', marginBottom: '10px', paddingBottom: '10px' }}>
              <p><strong>Question {index + 1}:</strong> {item.question}</p>
              {item.answer && <p><strong>Your Answer:</strong> {item.answer}</p>}
              {item.type === 'learning_plan' && item.planData && (
                <div>
                  <h4>Suggestions for you:</h4>
                  <ul>{item.planData.map((p, i) => <li key={i}>{p}</li>)}</ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Message History (optional to show during active dialog) */}
      <div ref={messagesContainerRef} style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
        {history.map((item: HistoryItem, index: number) => (
          <div key={index} style={{ borderBottom: '1px solid #eee', marginBottom: '10px', paddingBottom: '10px' }}>
            <p><strong>Q{index + 1}:</strong> {item.question}</p>
            {item.answer && <p><strong>A:</strong> {item.answer}</p>}
            {item.type === 'learning_plan' && item.planData && (
                <div>
                  <h4>Historical Suggestion:</h4>
                  <ul>{item.planData.map((p, i) => <li key={i}>{p}</li>)}</ul>
                </div>
              )}
          </div>
        ))}
      </div>

      {/* Current Question and Answer Options */}
      <div style={{ marginTop: '20px', borderTop: '2px solid #007bff', paddingTop: '20px'}}>
        <h4>Current Question: {currentNode.question_text}</h4>
        {currentNode.answer_type === 'single_select' && (
          currentNode.answers.map(answer => (
            <button key={answer.answer_id} onClick={() => handleSelection(answer.answer_id)}
                    style={{ display: 'block', margin: '5px 0', padding: '10px', width: '100%' }}>
              {answer.answer_text}
            </button>
          ))
        )}

        {currentNode.answer_type === 'multi_select' && (
          <>
            {currentNode.answers.map(answer => (
              <label key={answer.answer_id} style={{ display: 'block', margin: '5px 0' }}>
                <input
                  type="checkbox"
                  checked={selectedAnswers.includes(answer.answer_id)}
                  onChange={() => handleMultiSelect(answer.answer_id)}
                />
                {answer.answer_text}
              </label>
            ))}
            <button onClick={confirmSelections} disabled={selectedAnswers.length === 0}
                    style={{ marginTop: '10px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
              Confirm Selection
            </button>
          </>
        )}

        {currentNode.answer_type === 'auto_complete' && (
          <p><i>Processing, please wait...</i></p>
          // For auto_complete, the Hook usually handles it automatically.
          // If autoCompleteDelay is configured, it will advance after the delay.
          // If asynchronous operations are needed, implement them externally and call handleSelection 
          // with the ID of the corresponding answer after completion.
        )}
      </div>
    </div>
  );
}
```

**Key Points:**

*   **Dialog End**: When `currentNode` is `null`, the dialog flow is complete. You can then display the full user history, the final `learningPlan` (usually by extracting items with `type === 'learning_plan'` from the history), and provide an option to reset the dialog.
*   **Rendering History (`history`)**: Iterate over the `history` array to display previous Q&As. The `type` field of `HistoryItem` can distinguish between regular messages and system-generated learning plans.
*   **Rendering Current Node (`currentNode`)**:
    *   Display `currentNode.question_text`.
    *   Based on `currentNode.answer_type`:
        *   `single_select`: Render buttons or radio inputs. On click, call `handleSelection(answer.answer_id)`.
        *   `multi_select`: Render checkboxes. On `onChange`, call `handleMultiSelect(answer.answer_id)` to update `selectedAnswers`. Provide a confirmation button that calls `confirmSelections()` on click.
        *   `auto_complete`: Usually handled automatically. If `autoCompleteDelay` is configured, it advances after the delay. For custom async operations, implement them externally and drive the flow using `handleSelection` (if an `DialogAnswer` is configured for the `auto_complete` node) upon completion.
*   **Scroll Handling**: As shown in the example, listen for the `SCROLL_TO_BOTTOM_EVENT` and make the container holding messages scroll to the bottom.

### 4. Options (`UseDialogOptions`)

You can pass an options object as the second argument to `useDialog` to customize the Hook's behavior:

```typescript
interface UseDialogOptions {
  /** 
   * Initial node ID.
   * If not provided, the first node in the dialogData array is used as the starting point of the dialog by default.
   */
  initialNodeId?: string;

  /** 
   * Custom node lookup function.
   * Allows you to provide your own logic to find a node by its nodeId from dialogData (or any other source).
   * This is very useful if your data structure is complex or if node data needs to be loaded asynchronously.
   * The function should accept nodeId and the original dialogData as arguments and return DialogNode | null.
   * Example: findNodeById: (nodeId, data) => data.find(n => n.id === nodeId) || null
   */
  findNodeById?: (nodeId: string, dialogData: DialogNode[]) => DialogNode | null;

  /** 
   * Delay time (in milliseconds) for auto-complete nodes.
   * For nodes with answer_type 'auto_complete', after the node becomes current,
   * wait for this delay time before automatically processing and advancing.
   * Default value is 0 (process immediately).
   */
  autoCompleteDelay?: number;
}
```

**Example:**

```tsx
const options: UseDialogOptions = {
  initialNodeId: 'custom_start_node',
  autoCompleteDelay: 1500, // Auto-complete node delays for 1.5 seconds
  // findNodeById: (id, data) => /* ...your custom lookup logic... */
};

// const dialogState = useDialog(dialogData, options);
```

### 5. Event (`SCROLL_TO_BOTTOM_EVENT`)

The `react-use-chat` library exports `SCROLL_TO_BOTTOM_EVENT` (a string constant). When the Hook's internal logic determines that the chat interface should scroll to the bottom (e.g., when a new question or answer is added to the history, or when the current node changes), it triggers this custom event via `document.dispatchEvent(new CustomEvent(SCROLL_TO_BOTTOM_EVENT))`.

You can listen for this event in your React components to perform the scroll operation when the event is triggered. This allows the UI layer to be decoupled from the Hook's internal state changes while maintaining UI responsiveness.

**Example Listener and Handler:**

```tsx
import React, { useEffect } from 'react';
import { SCROLL_TO_BOTTOM_EVENT } from 'react-use-chat';

useEffect(() => {
  const handleScroll = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    // Or for a specific container:
    // const container = document.getElementById('chat-container');
    // if (container) container.scrollTop = container.scrollHeight;
  };

  document.addEventListener(SCROLL_TO_BOTTOM_EVENT, handleScroll);
  return () => document.removeEventListener(SCROLL_TO_BOTTOM_EVENT, handleScroll);
}, []);
```

This way, you can ensure that even if the user doesn't scroll manually, the chat interface automatically scrolls to the latest message when new content is added, enhancing the user experience.

## 📚 API Reference

### useDialog Hook

```tsx
const result = useDialog(dialogData, options);
```

#### Parameters

| Parameter    | Type               | Required | Description                        |
| ------------ | ------------------ | -------- | ---------------------------------- |
| `dialogData` | `DialogNode[]`     | ✅       | Dialog node data array             |
| `options`    | `UseDialogOptions` | ❌       | Configuration options              |

#### Options (`UseDialogOptions`)

```tsx
interface UseDialogOptions {
  initialNodeId?: string;        // Initial node ID
  findNodeById?: (nodeId: string, dialogData: DialogNode[]) => DialogNode | null; // Custom node lookup function
  autoCompleteDelay?: number;    // Auto-complete delay time (milliseconds)
}
```

#### Return Value (`UseDialogReturn`)

```tsx
interface UseDialogReturn {
  currentNode: DialogNode | null;           // Current node
  history: HistoryItem[];                   // History record
  learningPlan: string[];                   // Learning plan (accumulated plan_triggers)
  selectedAnswers: string[];                // Selected answers (for multi-select)
  multiSelectBranchStack: SelectionBranch[][]; // Multi-select branch stack
  currentBranchIndices: number[];           // Branch indices for the stack
  pendingPlanTriggers: string[];            // Pending plan triggers before finalization
  handleSelection: (answerId: string) => void;      // Handle single selection
  handleMultiSelect: (answerId: string) => void;    // Handle multi-selection toggle
  confirmSelections: () => void;            // Confirm multi-selections
  resetDialog: () => void;                  // Reset dialog
}
```

### Data Structures

#### DialogNode

```tsx
interface DialogNode {
  node_id: string;
  question_text: string;
  answer_type: AnswerType;
  answers: DialogAnswer[];
  default_next_node_id?: string | null;
  default_plan_trigger?: string | null;
  execute_by_config_order?: boolean;
  is_branch_end?: boolean;
}
```

#### DialogAnswer

```tsx
interface DialogAnswer {
  answer_id: string;
  answer_text: string;
  next_node_id: string | null;
  plan_trigger: string | null;
  execution_order?: number;
  mutually_exclusive?: boolean;
}
```

#### AnswerType

```tsx
type AnswerType = "single_select" | "multi_select" | "auto_complete";
```

## 🎯 Advanced Usage

### Nested Multi-Select Branches

The system supports complex nested multi-select scenarios:

```tsx
const complexDialogData: DialogNode[] = [
  {
    node_id: 'subjects',
    question_text: 'Choose the subjects you want to learn:',
    answer_type: 'multi_select',
    execute_by_config_order: true,
    answers: [
      {
        answer_id: 'math',
        answer_text: 'Mathematics',
        next_node_id: 'math_topics', // Points to another multi-select node
        plan_trigger: null,
        execution_order: 0,
      },
      {
        answer_id: 'english',
        answer_text: 'English',
        next_node_id: 'english_skills', // Points to another multi-select node
        plan_trigger: null,
        execution_order: 1,
      },
    ],
  },
  // Multi-select node for math topics
  {
    node_id: 'math_topics',
    question_text: 'Choose your focus areas in Mathematics:',
    answer_type: 'multi_select',
    answers: [
      {
        answer_id: 'algebra',
        answer_text: 'Algebra',
        next_node_id: null,
        plan_trigger: 'Algebra Learning Plan',
      },
      {
        answer_id: 'geometry',
        answer_text: 'Geometry',
        next_node_id: null,
        plan_trigger: 'Geometry Learning Plan',
      },
    ],
  },
  // ... more nodes
];
```

### Mutually Exclusive Options

In multi-select mode, you can set mutually exclusive options:

```tsx
const dialogNode: DialogNode = {
  node_id: 'level_selection',
  question_text: 'Select your level and learning preferences:',
  answer_type: 'multi_select',
  answers: [
    {
      answer_id: 'beginner',
      answer_text: 'Beginner',
      mutually_exclusive: true, // Mutually exclusive with other level options
      next_node_id: null,
      plan_trigger: 'Beginner Plan',
    },
    {
      answer_id: 'advanced',
      answer_text: 'Advanced',
      mutually_exclusive: true, // Mutually exclusive with other level options
      next_node_id: null,
      plan_trigger: 'Advanced Plan',
    },
    {
      answer_id: 'visual_learner',
      answer_text: 'Visual Learner',
      next_node_id: null,
      plan_trigger: 'Visual Learning Plan',
    },
  ],
};
```

### Auto-Complete Node

```tsx
const dialogNode: DialogNode = {
  node_id: 'processing',
  question_text: 'Generating your personalized learning plan...',
  answer_type: 'auto_complete',
  answers: [], // Often empty or a single answer for auto_complete path
  default_next_node_id: 'results',
  default_plan_trigger: null,
};
```
If `answers` is not empty for an `auto_complete` node, the hook typically expects a single `DialogAnswer` in the `answers` array to define the path. `handleSelection` would be called with its `answer_id` (often internally by the hook after `autoCompleteDelay` or if no delay, immediately).


### Custom Node Lookup

```tsx
// const dialogData: DialogNode[] = [ ... ];
// const options: UseDialogOptions = {
//   findNodeById: (nodeId, data) => {
//     // Custom lookup logic, e.g., fetch from an API
//     // This is a simplified example. API calls should return a Promise<DialogNode | null>
//     // and be handled appropriately if useDialog expects synchronous return or supports async.
//     // For now, assume synchronous:
//     return data.find(node => node.node_id === nodeId) || null; 
//     // If async:
//     // return fetch(`/api/nodes/${nodeId}`).then(res => res.json());
//   },
// };
// const { currentNode } = useDialog(dialogData, options);
```
Note: The `findNodeById` in `UseDialogOptions` as defined in `types.ts` is synchronous: `(nodeId: string, dialogData: DialogNode[]) => DialogNode | null;`. If you need asynchronous node fetching, you'd have to manage that outside the hook and feed the data into `useDialog` or adapt the hook's internal logic.

### Scroll Event Listener

The Hook dispatches a scroll event when the dialog updates:

```tsx
import { useEffect } from 'react';
import { SCROLL_TO_BOTTOM_EVENT } from 'react-use-chat';

useEffect(() => {
  const handleScroll = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    // Or for a specific container:
    // const container = document.getElementById('chat-container');
    // if (container) container.scrollTop = container.scrollHeight;
  };

  document.addEventListener(SCROLL_TO_BOTTOM_EVENT, handleScroll);
  return () => document.removeEventListener(SCROLL_TO_BOTTOM_EVENT, handleScroll);
}, []);
```

## 🎨 Style Customization

The Hook itself does not include styles; you can fully customize the UI. Refer to the CSS in the example project:
(The original `README.md` had this section empty, if you have example CSS, you can add it here or point to `example/src/App.css`)

## 🔧 Development

### Install Dependencies

```bash
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Run Example

```bash
cd example
npm install
npm start
```

## 📄 License

MIT © [JACKYZ](https://github.com/defaultjacky) 

## 🤝 Contributing

Contributions are welcome! Please read the [Contribution Guidelines](./CONTRIBUTING.en.md) for details.

### Contributors

<a href="https://github.com/defaultjacky/react-use-chat/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=defaultjacky/react-use-chat" />
</a>

## 📮 Support

- 💬 [GitHub Discussions](https://github.com/defaultjacky/react-use-chat/discussions)
- 🐛 [GitHub Issues](https://github.com/defaultjacky/react-use-chat/issues)
- 📧 [Email Support](mailto:defaultjacky@gmail.com) 

---

If this project helps you, please give it a ⭐️ to show your support! 