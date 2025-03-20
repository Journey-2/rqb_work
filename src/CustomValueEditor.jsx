import { initialQuery, baseFields, menHobbies, womenHobbies } from "./Fields";
import { ValueEditor } from "react-querybuilder";

/**
 * Custom Value Editor Component
 * - Uses a dropdown if the field has predefined values.
 */
export const CustomValueEditor = (props) => {
  //what this prop could look like
  // {
  //   "field": "gender",
  //   "value": "male",
  //   "handleOnChange": function(newValue) { ... },
  //   "operator": "="
  // }
  
  const field = props.field;//get the field
  console.log("Field : ",field)
  
  

  //find field metadata from all available fields
  const fieldData = [...baseFields, ...menHobbies, ...womenHobbies].find(
    (f) => f.name === field
  );

  console.log("Available Fields:", [...baseFields, ...menHobbies, ...womenHobbies]);

  console.log("Field data : ",fieldData);
  

  //ff field is not found, fall back to default ValueEditor
  if (!fieldData) {
    return <ValueEditor {...props} />;
  }

  //if the field has predefined values, use a dropdown
  if (fieldData.values) {
    //if fieldData.values exists, it means the field should use a dropdown <select>
    return (
      <select
        value={props.value}
        // The handleOnChange function updates the value when the user selects an option.
        onChange={(e) => props.handleOnChange(e.target.value)}
        
      >
        <option value="">Select...</option>
        {fieldData.values.map((option) => (
          <option key={option.name} value={option.name}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  //if the field does not have values, it falls back to a simple textbox.
  return <ValueEditor {...props} />;
};


/**
 * Custom Value Editor Component
 * - Shows dropdown selections for fields that have predefined values
 * - Falls back to default value editor for fields without predefined options
 */
// export const CustomValueEditor = (props) => {
//   const field = props.field;

//   // Find the field definition from all available fields
//   const fieldData = [...baseFields, ...menHobbies, ...womenHobbies].find(
//     (f) => f.name === field
//   );

//   // If field not found in our definitions, use default editor
//   if (!fieldData) {
//     return <ValueEditor {...props} />;
//   }

//   // If field has predefined values, show a dropdown
//   if (fieldData.values) {
//     return (
//       <select
//         // value={props.value || ""}  // Ensure we have at least an empty string as value
//         onChange={(e) => props.handleOnChange(e.target.value)}
//       >
//         <option value="">Select...</option>
//         {fieldData.values.map((option) => (
//           <option key={option.name} value={option.name}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//     );
//   }

//   // Fall back to default editor for fields without predefined values
//   return <ValueEditor {...props} />;
// };