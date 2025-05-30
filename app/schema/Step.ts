interface IntroStep {
  type: "intro";
  content: string;
}

interface TosStep {
  type: "tos";
  content: string;
}

interface QuestionStep {
  type: "question";
  id: string;
  label: string;
  placeholder: string;
  inputType: string;
}

interface ThankYouStep {
  type: "thankyou";
  content: string;
}

interface MultiInputStep {
  type: "multi-input";
  id: string;
  fields: {
    id: string;
    label: string;
    placeholder?: string;
    inputType: string;
    required: boolean;
  }[];
}

interface MultiSelectStep {
  type: "multi-select";
  id: string;
  question: string;
  secondaryHeading: string;
  options: string[];
  minRequired: number;
}

interface AdditionalContactsStep {
  type: "additionalContacts";
  id: string;
}

interface BirthdayAnniversariesStep {
  type: "birthdayAnniversaries";
  id: string;
}

type Step =
  | IntroStep
  | TosStep
  | QuestionStep
  | ThankYouStep
  | MultiInputStep
  | MultiSelectStep
  | AdditionalContactsStep
  | BirthdayAnniversariesStep;