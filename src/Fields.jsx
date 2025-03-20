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
        label: "Football",
        valueEditorType: "select",
        values: [
          {
            name: "american",
            label: "American"
          }
        ]
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
  {
    name: "gym",
    label: "Gym",
    valueEditorType: "select",
    values: [
      { 
        name: "calisthenics",
        label: "Calisthenics" 
      },
      { 
        name: "bodybuilding",
        label: "Bodybuilding" 
      },
    ],

  }
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
  {
    name: "yoga",
    label: "Yoga",
    valueEditorType: "select",
    values: [
      { 
        name: "hatha",
        label: "Hatha" 
      },
      { 
        name: "vinyasa",
        label: "Vinyasa" 
      },
    ],
  }
];

export const initialQuery = {
  combinator: "and",
  rules: [
    { field: "gender", operator: "=", value: "" },
    { field: "income", operator: "=", value: "" } 
  ],
};

