import { Step } from '../../lib/types';

export const STEPS: Step[] = [
  {
    id: 'struggle',
    title: 'The Pattern You Want to Break',
    questions: [
      {
        id: 'mainStruggle',
        text: 'Where do you notice yourself over-giving, over-explaining, avoiding conflict, or trying to be the "good guy" in a relationship?',
        type: 'textarea',
        maxLength: 1000,
      },
    ],
  },
  {
    id: 'covert_contracts',
    title: 'The Hidden Bargain',
    questions: [
      {
        id: 'covertContractsScale',
        text: 'On a scale of 1-10, how often do you do "nice" things while secretly hoping they earn affection, sex, validation, or relief from tension?',
        type: 'range',
        min: 1,
        max: 10,
      },
      {
        id: 'covertContractsExample',
        text: 'When the approval, affection, or relief does not come, what do you usually do next?',
        type: 'textarea',
        maxLength: 1000,
      },
    ],
  },
  {
    id: 'displeasure_tolerance',
    title: 'When She Is Upset',
    questions: [
      {
        id: 'displeasureReactions',
        text: 'When your partner, or a woman you are dating, is unhappy, disappointed, or angry, what happens in your body and behavior? For example: fixing, withdrawing, defending, apologizing, or getting resentful.',
        type: 'textarea',
        maxLength: 1000,
      },
    ],
  },
  {
    id: 'intake',
    title: 'Get Your Pattern Audit',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John', maxLength: 50 },
      { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe', maxLength: 50 },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', maxLength: 100 },
    ],
  },
];
