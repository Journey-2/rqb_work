import { initialQuery, baseFields, menHobbies, womenHobbies } from "./Fields";
import { ValueSelector, ValueEditor } from "react-querybuilder";


// //custom field selector to determine which field should be available based on the 
// //gender and whether rule belongs to a specific group of not
// export const FieldSelector = (props) => {
//   const { rule, context } = props;//use prop destructuring to get the values of 
//   // rule and context
//   //holds some value like this
//   // {
//   //   "rule": {
//   //     "id": "rule-123",
//   //     "field": "gender",
//   //     "operator": "=",
//   //     "value": "male",
//   //     "parentId": "group-456"
//   //   },
//   //   "context": {
//   //     "selectedGender": "male",
//   //     "groups": [
//   //       { "id": "group-456" },
//   //       { "id": "group-789" }
//   //     ]
//   //   }
//   // }

//   //later uses of this prop

//   //rule.field to the check which field is selected
//   //rule.parentId to get info on which group does the rule belong to

//   //context.selected gender holds the global state of the selected gender
//   //context.groups holds the info of all groups in the query
  
//   // console.log(props);
  

//   let availableFields = baseFields;

//   //check if the rule is inside a gender-based group
//   //it searches for a group in context.groups whose id matches the parentId of the current rule.
//   //if found, this means the current rule is inside a gender-specific group.
//   const parentGroup = context.groups.find((group) => group.id === rule.parentId);

//   //if the rule belongs to a parent and a gender has been selected
//   //if selected gender=male then show menHobbies and if not then show womenHobbies
//   if (parentGroup && context.selectedGender) {
//     availableFields = context.selectedGender === "male" ? menHobbies : womenHobbies;
//   }

//   //ValueSelector recieves all props and the modified available field
//   return <ValueSelector {...props} options={availableFields} />;
// };


/**
 * Custom Field Selector Component
 * - Dynamically filters available fields based on gender selection
 * - Shows gender-specific fields (sports for males, cosmetics for females) when inside a gender group
 * - Shows base fields (age, income, etc.) when at the root level
 */
export const FieldSelector = (props) => {
  const { rule, context } = props;

//   //holds some value like this
//   // {
//   //   "rule": {
//   //     "field": "gender",
//   //     "id": "be9d07bf-dffd-46bd-a2e3-5ce06397546c",
//   //     "operator": "=",
//   //     "value": "male",
//   //     "parentId": "7d9ad403-f6e4-4b4b-a37f-6effb6c281f5"
//   //   },
//   //   "context": {
//   //     "groups": [
//   //       { "id": "group-456" },
//   //       { "id": "group-789" }
//   //     ]
            // query:  {
            //   combinator: "and",
            //   id: "29b679e8-ee0a-41de-80a8-e7728e0ec794"
//   //   "rules": {
//   //     "comninator": "and",
//   //     "id": "be9d07bf-dffd-46bd-a2e3-5ce06397546c",
//   //     "parentId": "7d9ad403-f6e4-4b4b-a37f-6effb6c281f5"
//   //   },
//   //     "combinator": "and",
//   //     "id": "be9d07bf-dffd-46bd-a2e3-5ce06397546c",
//   //     "parentId": "7d9ad403-f6e4-4b4b-a37f-6effb6c281f5"
//   //   },
            // }
//   //   }
//   // }

  console.log("Rules : ",props.rule);
  console.log("Conext : ",props.context);
  

  
  // Start with base fields as default
  let availableFields = baseFields;
  
  // Check if this rule is inside a group (has a parentId)
  if (rule.parentId) {
    // Find the parent group this rule belongs to
    const parentGroup = context.groups.find(group => group.id === rule.parentId);
    
    // If parent group exists and is linked to a gender rule (has parentId)
    if (parentGroup && parentGroup.parentId) {
      // Find the gender rule in the query using the parent group's parentId
      const genderRule = context.query.rules.find(r => r.id === parentGroup.parentId);
      
      // If we found a valid gender rule with a value
      if (genderRule && genderRule.field === "gender" && genderRule.value) {
        // Choose field options based on the gender value
        availableFields = genderRule.value === "male" ? menHobbies : womenHobbies;
      }
    }
  }
  
  // Return a ValueSelector with the appropriate field options
  return <ValueSelector {...props} options={availableFields} />;
};