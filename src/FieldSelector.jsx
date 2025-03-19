import { initialQuery, baseFields, menHobbies, womenHobbies } from "./Fields";
import { ValueSelector, ValueEditor } from "react-querybuilder";


//custom field selector to determine which field should be available based on the 
//gender and whether rule belongs to a specific group of not
export const FieldSelector = (props) => {
  const { rule, context } = props;//use prop destructuring to get the values of 
  // rule and context
  //holds some value like this
  // {
  //   "rule": {
  //     "id": "rule-123",
  //     "field": "gender",
  //     "operator": "=",
  //     "value": "male",
  //     "parentId": "group-456"
  //   },
  //   "context": {
  //     "selectedGender": "male",
  //     "groups": [
  //       { "id": "group-456" },
  //       { "id": "group-789" }
  //     ]
  //   }
  // }

  //later uses of this prop

  //rule.field to the check which field is selected
  //rule.parentId to get info on which group does the rule belong to

  //context.selected gender holds the global state of the selected gender
  //context.groups holds the info of all groups in the query
  
  let availableFields = baseFields;

  //check if the rule is inside a gender-based group
  //it searches for a group in context.groups whose id matches the parentId of the current rule.
  //if found, this means the current rule is inside a gender-specific group.
  const parentGroup = context.groups.find((group) => group.id === rule.parentId);

  //if the rule belongs to a parent and a gender has been selected
  //if selected gender=male then show menHobbies and if not then show womenHobbies
  if (parentGroup && context.selectedGender) {
    availableFields = context.selectedGender === "male" ? menHobbies : womenHobbies;
  }

  //ValueSelector recieves all props and the modified available field
  return <ValueSelector {...props} options={availableFields} />;
};
