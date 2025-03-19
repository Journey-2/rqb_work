import { useState } from "react";
import { QueryBuilder, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { ValueSelector, ValueEditor } from "react-querybuilder";
import { initialQuery, baseFields, menHobbies, womenHobbies } from "./Fields";
import { v4 as uuidv4 } from "uuid";
import { FieldSelector } from "./FieldSelector";
import { CustomValueEditor } from "./CustomValueEditor";

export const App = () => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedGender, setSelectedGender] = useState("");
  const [groups, setGroups] = useState([]); //track groups with UUIDs

  //handles query change and dynamically updates fields based on gender
  const handleQueryChange = (newQuery) => {
    //newQuery.rules contains all the rules the user created
    const genderRuleIndex = newQuery.rules.findIndex((rule) => rule.field === "gender");//index for splicing
    const genderRule = newQuery.rules[genderRuleIndex];//look for gender rule indside newQuery.rules
    const newGender = genderRule ? genderRule.value : "";//get's the fields value from genderRule object  
  
    setSelectedGender(newGender);
  
    if (!newGender) {
      setQuery(newQuery);
      return;
    }
  
    //creating shallow copy to avoid mutating unnecessarily, because it 
    //interfeares with how rqb handles it's data structures
    let updatedRules = [...newQuery.rules];//store updated query rules
    let updatedGroups = [...groups];//store updated group 
  
    //find existing gender-specific group as groupd has rules array and combinator
    let existingGroupIndex = updatedRules.findIndex((rule) => rule.rules && rule.combinator);
  
    //if the rule does exists in the group. this is to change if the selected gender is is not of the correct type
    if (existingGroupIndex !== -1) {
      //store the gender specific group from update rules
      let existingGroup = updatedRules[existingGroupIndex];
  
      //create a new object instead of modifying state directly
      updatedRules[existingGroupIndex] = {
        ...existingGroup,
        rules: existingGroup.rules.filter(
          (rule) =>
            (newGender === "male" && rule.field !== "cosmetics") ||
            (newGender === "female" && rule.field !== "sports")
        ),
      };
  
      //ensure the gender-specific field exists
// Ensure the gender-specific field exists
    const ruleExists = updatedRules[existingGroupIndex].rules.some(
      (rule) => rule.field === (newGender === "male" ? "sports" : "cosmetics")
    );

    // If the gender-specific rule doesn’t exist, add it
    if (!ruleExists) {
      updatedRules[existingGroupIndex] = {
        ...updatedRules[existingGroupIndex],
        rules: [
          ...updatedRules[existingGroupIndex].rules,
          {
            id: uuidv4(),
            field: newGender === "male" ? "sports" : "cosmetics",
            operator: "=",
            value: "",
            parentId: existingGroup.id, // ✅ Correctly bind to parent group
          },
        ],
      };
    }

      //if there were not existing gender specfic group create a new one 
    } else {
      //create a gender-specific group with the correct `parentId`
      const newGroupId = uuidv4();
      const newRuleId = uuidv4();
      
      let genderSpecificGroup = {
        id: newGroupId,
        combinator: "and",
        rules: [
          {
            id: newRuleId,
            field: newGender === "male" ? "sports" : "cosmetics",
            operator: "=",
            value: "",
            parentId: newGroupId, // Assign correct parent ID
          },
        ],
      };
  
      //use splice to insert the group right after the gender rule
      //.splice(index,0,item)
      updatedRules.splice(genderRuleIndex + 1, 0, genderSpecificGroup);

      //add the new group to updatedGroups
      updatedGroups.push({ id: newGroupId });
    }
  
    setGroups(updatedGroups);//updates the list of group
    setQuery({ ...newQuery, rules: updatedRules });//updates the query 
  };
  
  return (
    <div>
      <QueryBuilder
        query={query}
        onQueryChange={handleQueryChange}
        controlElements={{
          fieldSelector: FieldSelector,
          valueEditor: CustomValueEditor,
        }}
        context={{ selectedGender, groups }} // Pass groups to context
      />
      <h4>Query</h4>
      <pre>
        <code>{formatQuery(query, "json")}</code>
      </pre>
    </div>
  );
};
