import { Step } from '../../lib/types';

export const STEPS: Step[] = [
  {
    id: 'intake',
    title: 'Tell me about yourself.',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John', maxLength: 50 },
      { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe', maxLength: 50 },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', maxLength: 100 },
    ],
  },
  {
    id: 'struggle',
    title: 'What is your biggest current struggle?',
    questions: [
      {
        id: 'mainStruggle',
        text: 'Briefly describe what is currently feeling "out of alignment" in your life (career, relationship, or personal growth).',
        type: 'textarea',
        maxLength: 1000,
      },
    ],
  },
  {
    id: 'action',
    title: 'Ownership vs. Victimhood',
    questions: [
      {
        id: 'ownership',
        text: 'On a scale of 1-10, how much ownership are you taking for this situation versus blaming external factors?',
        type: 'range',
        min: 1,
        max: 10,
      },
      {
        id: 'victimhood',
        text: 'Where do you feel like a "victim" in your life right now?',
        type: 'textarea',
        maxLength: 1000,
      },
    ],
  },
  {
    id: 'thinking',
    title: 'Thinking vs. Acting',
    questions: [
      {
        id: 'rumination',
        text: 'Are you trying to "think" your way out of this problem, or are you taking physical steps to change it?',
        type: 'textarea',
        maxLength: 1000,
      },
    ],
  },
];
