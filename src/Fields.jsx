export const baseFields = [
  {
    name: "gender",
    label: "Gender",
    operator: '=',
    valueEditorType: "select",
    values: [
      {
        name: "male",
        label: "Male" 
      },
      { 
        name: "female",
        label: "Female" 
      },
    ],
  },
  {
    name: "income",
    label: "Income",
    valueEditorType: "select",
    values: [
      { 
        name: "high",
        label: "High Income" 
      },
      { 
        name: "medium",
        label: "Medium Income" 
      },
      { 
        name: "low",
        label: "Low Income" 
      },
    ],
  },
];

export const menHobbies = [
  {
    name: "sports",
    label: "Sports",
    valueEditorType: "select",
    values: [
      { 
        name: "football",
        label: "Football" 
      },
      { 
        name: "basketball",
        label: "Basketball" 
      },
      { 
        name: "cricket",
        label: "Cricket" 
      },
    ],
  },
];

export const womenHobbies = [
  {
    name: "cosmetics",
    label: "Cosmetics",
    valueEditorType: "select",
    values: [
      { 
        name: "lipstick",
        label: "Lip Sticks" 
      },
      { 
        name: "eyeliner",
        label: "Eyeliner" 
      },
      { 
        name: "foundation",
        label: "Foundation" 
      },
    ],
  },
];

export const initialQuery = {
  combinator: "and",
  rules: [
    { field: "gender", operator: "=", value: "" },
    { field: "income", operator: "=", value: "" } 
  ],
};