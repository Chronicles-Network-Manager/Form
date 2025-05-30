export const steps: Step[] = [
  {
    type: "intro",
    content: `Hey there!\n\nHi! I’m Jonathan. Whether we’re old friends or new acquaintances, I’d love to get to know you better through this form. I’m especially interested in learning who to turn to when I need advice about moving to a new city (which you may have lived in at some point) or trying out new activities that you may be interested in.\n\nFeel free to answer as much as you like — the more details, the better! Without further ado, let’s get started.`,
  },
  {
    type: "tos",
    content: `Terms of Data Use\n\nThis is a personal project, and all the information you provide will be used solely for my personal use. Your data will be stored privately on my home computer and will not be shared publicly. If you don’t feel comfortable sharing this information, that’s completely fine!`,
  },
  {
    type: "multi-input",
    id: "name-contact",
    fields: [
      { id: "firstName", label: "First Name *", inputType: "text", required: true },
      { id: "middleName", label: "Middle Name(s) (optional)", inputType: "text", required: false },
      { id: "lastName", label: "Last Name *", inputType: "text", required: true },
      { id: "phone", label: "Primary Phone Number *", inputType: "tel", required: true },
      { id: "email", label: "Primary Email *", inputType: "email", required: true },
    ],
  },
  {
    type: "multi-select",
    id: "relationship",
    question: "How do we know each other?",
    secondaryHeading: "Any 3rd places would go into Community (The Library, Through Sports, Online, etc)",
    options: [
      "Family",
      "Friends",
      "Work",
      "School",
      "College",
      "Acquaintances",
      "WE JUST MET",
      "Community",
      "Other",
    ],
    minRequired: 1,
  },
  {
    type: "additionalContacts",
    id: "additionalContacts",
  },
  {
    type: "birthdayAnniversaries",  // NEW step for birthday + anniversaries
    id: "birthdayAnniversaries",
  },
  {
    type: "question",
    id: "name",
    label: "What's your name?",
    placeholder: "John Doe",
    inputType: "text",
  },
  {
    type: "question",
    id: "email",
    label: "What's your email address?",
    placeholder: "john@example.com",
    inputType: "email",
  },
  {
    type: "question",
    id: "age",
    label: "How old are you?",
    placeholder: "25",
    inputType: "number",
  },
  {
    type: "thankyou",
    content: "", // We'll render custom thank you content
  },
];