import { DialogNode } from 'react-use-chat';

const auto_complete_node: DialogNode[] = [
  {
    "node_id": "some_auto_step_node",
    "question_text": "来来来，一起巩固一下...", // 此文本将短暂显示
    "answer_type": "auto_complete",
    "answers": [], // answers 数组现在可以为空
    "default_next_node_id": "initialize_subject_entry", // 使用新的字段指定下一节点
    "default_plan_trigger": null // 或具体的 plan trigger
  }
]

const initialize_node: DialogNode[] = [
  {
    "node_id": "initialize_subject_entry",
    "question_text": "你想选择的学科是：",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "english_node",
        "answer_text": "英语",
        "next_node_id": "english_learning_need_entry",
        "plan_trigger": null
      },
      {
        "answer_id": "chemistry_node",
        "answer_text": "化学",
        "next_node_id": "chemistry_learning_need_entry",
        "plan_trigger": null
      }
    ]
  }
]

const end_node: DialogNode[] = [
  {
    "node_id": "end_subject_entry",
    "question_text": "你还想选择哪个学科？",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "english",
        "answer_text": "英语",
        "next_node_id": "english_learning_need_entry",
        "plan_trigger": null
      },
      {
        "answer_id": "chemistry",
        "answer_text": "化学",
        "next_node_id": "chemistry_learning_need_entry",
        "plan_trigger": null
      },
      {
        "answer_id": "拜拜",
        "answer_text": "再见，我走啦",
        "next_node_id": null,
        "plan_trigger": "拜拜触发器"
      }
    ]
  }
]


const english: DialogNode[] = [
  {
    "node_id": "english_learning_need_entry",
    "question_text": "你的学习需求是：",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "ans_need_A",
        "answer_text": "上学期英语学习有困难，巩固薄弱知识点",
        "next_node_id": "node_review_weaknesses",
        "plan_trigger": null
      },
      {
        "answer_id": "ans_need_B",
        "answer_text": "上学期英语学习还不错，预习下学期新内容",
        "next_node_id": "node_preview_options",
        "plan_trigger": null
      },
      {
        "answer_id": "ans_need_C",
        "answer_text": "英语成绩一直不错，拓展课外英语能力",
        "next_node_id": "node_expand_options",
        "plan_trigger": null
      }
    ]
  },
  // A-复习巩固
  {
    "node_id": "node_review_weaknesses",
    "question_text": "你的薄弱环节主要是：",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "ans_weakness_A_vocab",
        "answer_text": "词汇（如拼写易错、词义混淆）",
        "next_node_id": "node_vocab_specific_need",
        "plan_trigger": null
      },
      {
        "answer_id": "ans_weakness_B_grammar",
        "answer_text": "语法（如从句、非谓语结构不清）",
        "next_node_id": null,
        "plan_trigger": "高一重点语法复习"
      },
      {
        "answer_id": "ans_weakness_C_exam_skills",
        "answer_text": "考试技巧（如阅读理解速度慢、写作结构混乱）",
        "next_node_id": "node_exam_skill_topic",
        "plan_trigger": null
      }
    ]
  },
  {
    "node_id": "node_vocab_specific_need",
    "question_text": "你的词汇学习的需求是：",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "ans_vocab_need_A_increase",
        "answer_text": "提升词汇量",
        "next_node_id": null,
        "plan_trigger": "词汇量不足"
      },
      {
        "answer_id": "ans_vocab_need_B_usage",
        "answer_text": "掌握重点词汇的用法",
        "next_node_id": null,
        "plan_trigger": "词汇学不透"
      }
    ]
  },
  {
    "node_id": "node_exam_skill_topic",
    "question_text": "最近几次考试中，哪个题型最影响得分？",
    "answer_type": "multi_select",
    "execute_by_config_order": true,
    "answers": [
      {
        "answer_id": "ans_skill_topic_A_listening",
        "answer_text": "听力理解",
        "next_node_id": "node_listening_issue_type",
        "plan_trigger": null,
        "execution_order": 0
      },
      {
        "answer_id": "ans_skill_topic_B_reading",
        "answer_text": "阅读理解",
        "next_node_id": "node_reading_issue_type",
        "plan_trigger": null,
        "execution_order": 1
      },
      {
        "answer_id": "ans_skill_topic_C_cloze",
        "answer_text": "完形填空",
        "next_node_id": "node_cloze_issue_type",
        "plan_trigger": null,
        "execution_order": 2
      },
      {
        "answer_id": "ans_skill_topic_D_grammarfill",
        "answer_text": "语法填空",
        "next_node_id": "node_grammarfill_issue_type",
        "plan_trigger": null,
        "execution_order": 3
      },
      {
        "answer_id": "ans_skill_topic_E_appliedwriting",
        "answer_text": "应用文写作",
        "next_node_id": "node_appliedwriting_issue_type",
        "plan_trigger": null,
        "execution_order": 4
      },
      {
        "answer_id": "ans_skill_topic_F_continuation",
        "answer_text": "读后续写",
        "next_node_id": "node_continuationwriting_issue_type",
        "plan_trigger": null,
        "execution_order": 5
      }
    ]
  },
  {
    "node_id": "node_listening_issue_type",
    "question_text": "关于听力理解，你的情况是：",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "ans_listening_A_cannot_understand",
        "answer_text": "听不懂内容",
        "next_node_id": null,
        "plan_trigger": "听力基础知识"
      },
      {
        "answer_id": "ans_listening_B_cannot_answer",
        "answer_text": "听懂了回答不上问题",
        "next_node_id": null,
        "plan_trigger": "听力理解技能"
      }
    ]
  },
  {
    "node_id": "node_reading_issue_type",
    "question_text": "关于阅读理解，你的情况是：",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "ans_reading_A_vocab_barrier",
        "answer_text": "词汇有障碍",
        "next_node_id": null,
        "plan_trigger": "词汇量不足"
      },
      {
        "answer_id": "ans_reading_B_sentence_barrier",
        "answer_text": "句子理解有困难",
        "next_node_id": null,
        "plan_trigger": "长难句理解"
      },
      {
        "answer_id": "ans_reading_C_comprehension_skill",
        "answer_text": "文本都理解但做题经常错",
        "next_node_id": null,
        "plan_trigger": "阅读理解技能"
      }
    ]
  },
  {
    "node_id": "node_cloze_issue_type",
    "question_text": "关于完形填空，你的情况是：",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "ans_cloze_A_vocab_unfamiliar",
        "answer_text": "词汇不熟悉",
        "next_node_id": "node_cloze_vocab_issue_detail",
        "plan_trigger": null
      },
      {
        "answer_id": "ans_cloze_B_cannot_choose",
        "answer_text": "词汇熟悉但选不出答案",
        "next_node_id": null,
        "plan_trigger": "完形填空解题技巧"
      }
    ]
  },
  {
    "node_id": "node_cloze_vocab_issue_detail",
    "question_text": "关于词汇不熟悉，你的情况是：",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "ans_cloze_vocab_A_dont_know",
        "answer_text": "词汇不认识",
        "next_node_id": null,
        "plan_trigger": "词汇量不足"
      },
      {
        "answer_id": "ans_cloze_vocab_B_usage_unfamiliar",
        "answer_text": "一词多义、变形、搭配不熟悉",
        "next_node_id": null,
        "plan_trigger": "完形填空词汇"
      }
    ]
  },
  {
    "node_id": "node_grammarfill_issue_type",
    "question_text": "关于语法填空，你的情况是：",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "ans_grammarfill_A_with_hint",
        "answer_text": "有提示词的空错的多",
        "next_node_id": null,
        "plan_trigger": "语法填空有提示词解题技巧"
      },
      {
        "answer_id": "ans_grammarfill_B_no_hint",
        "answer_text": "没提示词的空错的多",
        "next_node_id": null,
        "plan_trigger": "语法填空无提示词解题技巧"
      }
    ]
  },
  {
    "node_id": "node_appliedwriting_issue_type",
    "question_text": "关于应用文写作，你的情况是：",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "ans_appliedwriting_A_type_recognition",
        "answer_text": "无法辨别应用文类型",
        "next_node_id": null,
        "plan_trigger": "审题选模板"
      },
      {
        "answer_id": "ans_appliedwriting_B_expression_weak",
        "answer_text": "词句写得不够精彩",
        "next_node_id": null,
        "plan_trigger": "表达更精彩"
      }
    ]
  },
  {
    "node_id": "node_continuationwriting_issue_type",
    "question_text": "关于读后续写，你的情况是：",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "ans_continuationwriting_A_plot_difficulty",
        "answer_text": "情节构思有困难",
        "next_node_id": null,
        "plan_trigger": "读后续写情节设计"
      },
      {
        "answer_id": "ans_continuationwriting_B_expression_weak",
        "answer_text": "词句写得不够精彩",
        "next_node_id": null,
        "plan_trigger": "读后续写词句升级"
      }
    ]
  },
  // B-新知预习
  {
    "node_id": "node_preview_options",
    "question_text": "你想预习哪方面的知识：",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "ans_preview_A_vocab",
        "answer_text": "下学期的核心词汇",
        "next_node_id": null,
        "plan_trigger": "词汇预习"
      },
      {
        "answer_id": "ans_preview_B_grammar",
        "answer_text": "下学期重点语法",
        "next_node_id": null,
        "plan_trigger": "语法预习"
      },
      {
        "answer_id": "ans_preview_C_new_type",
        "answer_text": "新题型——读后续写",
        "next_node_id": null,
        "plan_trigger": "读后续写预备"
      }
    ]
  },
  // C-视野拓展
  {
    "node_id": "node_expand_options",
    "question_text": "你想拓展自己哪方面的能力：",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "ans_expand_A_listening",
        "answer_text": "原声听力",
        "next_node_id": null,
        "plan_trigger": "VOA听力拓展"
      },
      {
        "answer_id": "ans_expand_B_reading_magazines",
        "answer_text": "外刊阅读",
        "next_node_id": null,
        "plan_trigger": "外刊拓展阅读"
      },
      {
        "answer_id": "ans_expand_C_reading_books",
        "answer_text": "原著阅读",
        "next_node_id": null,
        "plan_trigger": "原著拓展阅读"
      }
    ]
  }
]

const chemistry: DialogNode[] = [
  {
    "node_id": "chemistry_learning_need_entry",
    "question_text": "你想要复习巩固还是新知预习？",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "chem_need_review",
        "answer_text": "复习巩固",
        "next_node_id": "chem_review_weaknesses",
        "plan_trigger": null,
      },
      {
        "answer_id": "chem_need_preview",
        "answer_text": "新知预习",
        "next_node_id": null,
        "plan_trigger": "化学预习内容"
      }
    ]
  },
  // 复习巩固部分
  {
    "node_id": "chem_review_weaknesses",
    "question_text": "最近一次考试中，哪部分内容最影响得分？",
    "answer_type": "multi_select",
    "execute_by_config_order": true,
    "answers": [
      {
        "answer_id": "chem_weakness_unknown",
        "answer_text": "我也不知道哪里失分最多，失分都很多",
        "next_node_id": "chem_review_time_available",
        "plan_trigger": null,
        "execution_order": 0,
        "mutually_exclusive": true
      },
      {
        "answer_id": "chem_weakness_s_n_compounds",
        "answer_text": "硫、氮及其化合物",
        "next_node_id": "chem_s_n_compounds_detail",
        "plan_trigger": null,
        "execution_order": 1
      },
      {
        "answer_id": "chem_weakness_reaction_rate",
        "answer_text": "化学反应速率与化学平衡",
        "next_node_id": "chem_reaction_rate_detail",
        "plan_trigger": null,
        "execution_order": 2
      },
      {
        "answer_id": "chem_weakness_primary_cell",
        "answer_text": "原电池",
        "next_node_id": "chem_primary_cell_detail",
        "plan_trigger": null,
        "execution_order": 3
      },
      {
        "answer_id": "chem_weakness_organic",
        "answer_text": "有机化合物",
        "next_node_id": "chem_organic_detail",
        "plan_trigger": null,
        "execution_order": 4
      },
      {
        "answer_id": "chem_weakness_resources",
        "answer_text": "自然资源开发与利用",
        "next_node_id": "chem_resources_detail",
        "plan_trigger": null,
        "execution_order": 5
      }
    ]
  },
  // 不知道哪里失分最多
  {
    "node_id": "chem_review_time_available",
    "question_text": "你是否有充足的时间重新梳理本学期的内容",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "chem_time_sufficient",
        "answer_text": "是的，我有充足的时间",
        "next_node_id": null,
        "plan_trigger": "小白层-完整版"
      },
      {
        "answer_id": "chem_time_limited",
        "answer_text": "不，我只想梳理这本书的重点内容",
        "next_node_id": null,
        "plan_trigger": "小白层-精选版"
      }
    ]
  },
  // 硫、氮及其化合物
  {
    "node_id": "chem_s_n_compounds_detail",
    "question_text": "你是否清楚硫、氮及其化合物的性质及转化",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "chem_s_n_compounds_unclear",
        "answer_text": "不够清楚",
        "next_node_id": null,
        "plan_trigger": "硫、氮及其化合物-基础"
      },
      {
        "answer_id": "chem_s_n_compounds_clear_but_difficult",
        "answer_text": "清楚，但是题目不会做",
        "next_node_id": null,
        "plan_trigger": "硫、氮及其化合物-提高"
      }
    ]
  },
  // 化学反应速率与化学平衡
  {
    "node_id": "chem_reaction_rate_detail",
    "question_text": "你是否清楚化学反应速率的计算、化学平衡的含义及标志",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "chem_reaction_rate_unclear",
        "answer_text": "不够清楚",
        "next_node_id": null,
        "plan_trigger": "化学反应速率与化学平衡-基础"
      },
      {
        "answer_id": "chem_reaction_rate_clear_but_difficult",
        "answer_text": "清楚，但是题目不会做",
        "next_node_id": null,
        "plan_trigger": "化学反应速率与化学平衡-提高"
      }
    ]
  },
  // 原电池
  {
    "node_id": "chem_primary_cell_detail",
    "question_text": "你是否清楚原电池的构成条件、正负极的判断、电荷流向及电极反应式的书写",
    "answer_type": "single_select",
    // "is_branch_end": true,
    "answers": [
      {
        "answer_id": "chem_primary_cell_unclear",
        "answer_text": "不够清楚",
        "next_node_id": null,
        "plan_trigger": "原电池-基础"
      },
      {
        "answer_id": "chem_primary_cell_clear_but_difficult",
        "answer_text": "清楚，但是题目不会做",
        "next_node_id": null,
        "plan_trigger": "原电池-提高"
      }
    ]
  },
  // 有机化合物
  {
    "node_id": "chem_organic_detail",
    "question_text": "你是否清楚有机化合物的概念、结构与性质",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "chem_organic_unclear",
        "answer_text": "不够清楚",
        "next_node_id": null,
        "plan_trigger": "有机化合物-基础"
      },
      {
        "answer_id": "chem_organic_clear_but_difficult",
        "answer_text": "清楚，但是题目不会做",
        "next_node_id": null,
        "plan_trigger": "有机化合物-提高"
      }
    ]
  },
  // 自然资源开发与利用
  {
    "node_id": "chem_resources_detail",
    "question_text": "你是否清楚煤、石油、天然气的利用方式及绿色化学的含义",
    "answer_type": "single_select",
    "answers": [
      {
        "answer_id": "chem_resources_unclear",
        "answer_text": "不够清楚",
        "next_node_id": null,
        "plan_trigger": "自然资源开发与利用-基础"
      },
      {
        "answer_id": "chem_resources_clear_but_difficult",
        "answer_text": "清楚，但是题目不会做",
        "next_node_id": null,
        "plan_trigger": "自然资源开发与利用-提高"
      }
    ]
  },
]

export const exampleDialogData: DialogNode[] = [
  ...auto_complete_node,
  ...initialize_node,
  ...english,
  ...chemistry,
  ...end_node,
];
