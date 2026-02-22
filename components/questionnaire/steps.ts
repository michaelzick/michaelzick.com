import { Step } from '../../lib/types';

export const STEPS: Step[] = [
  {
    id: 'struggle',
    title: 'The Struggle',
    questions: [
      {
        id: 'mainStruggle',
        text: 'Where do you find yourself over-giving, auditioning for approval, or performing in your relationships?',
        type: 'textarea',
        maxLength: 1000,
      },
    ],
  },
  {
    id: 'covert_contracts',
    title: 'Covert Contracts',
    questions: [
      {
        id: 'covertContractsScale',
        text: 'On a scale of 1-10, how often do you do "nice" things with the secret expectation of receiving affection, sex, or validation in return?',
        type: 'range',
        min: 1,
        max: 10,
      },
      {
        id: 'covertContractsExample',
        text: 'What happens when that secret expectation isn\'t met?',
        type: 'textarea',
        maxLength: 1000,
      },
    ],
  },
  {
    id: 'displeasure_tolerance',
    title: 'Displeasure Tolerance',
    questions: [
      {
        id: 'displeasureReactions',
        text: 'When your partner (or a woman you are dating) is unhappy, disappointed, or angry, how do you typically react? (e.g., trying to fix it immediately, withdrawing, getting defensive, apologizing excessively)',
        type: 'textarea',
        maxLength: 1000,
      },
    ],
  },
  {
    id: 'intake',
    title: 'Tell me about yourself.',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John', maxLength: 50 },
      { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe', maxLength: 50 },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', maxLength: 100 },
    ],
  },
];
