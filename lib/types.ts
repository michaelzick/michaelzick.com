export interface Question {
  id: string;
  text: string;
  type: 'textarea' | 'range';
  min?: number;
  max?: number;
}

export interface IntakeField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
}

export interface Step {
  id: string;
  title: string;
  fields?: IntakeField[];
  questions?: Question[];
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  answers: Record<string, string>;
}
