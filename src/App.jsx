import { useState } from "react";
import { QueryBuilder, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { ValueSelector, ValueEditor } from "react-querybuilder";
import { initialQuery, baseFields, menHobbies, womenHobbies } from "./Fields";
import { v4 as uuidv4 } from "uuid";
import { CustomValueEditor } from "./CustomValueEditor"; 
import { FieldSelector } from "./FieldSelector";

export const App = () => {
  // Main query state for the QueryBuilder
  const [query, setQuery] = useState(initialQuery);
  console.log("Shape pf Query: ",query)  
  
  // State to track the currently selected gender (for context)
  const [selectedGender, setSelectedGender] = useState("");
  
  // State to track all groups and their relationships
  const [groups, setGroups] = useState([]);

  const handleQueryChange = (newQuery) => {
    // Find gender rules in both previous and current query states
    const previousGenderRules = query.rules.filter((rule) => rule.field === "gender");
    const currentGenderRules = newQuery.rules.filter((rule) => rule.field === "gender");

    // Update the selected gender state when gender rule changes
    if (currentGenderRules.length > 0) {
      const genderValue = currentGenderRules[0].value;
      if (genderValue) {
        setSelectedGender(genderValue);
      }
    } else {
      setSelectedGender(""); // Reset if no gender rule exists
    }

    // Detect gender rules that have been deleted
    const deletedGenderRules = previousGenderRules.filter(
      (prevRule) => !currentGenderRules.some((currRule) => currRule.id === prevRule.id)
    );

    // Create copies of rules and groups to work with
    let updatedRules = [...newQuery.rules];
    let updatedGroups = [...groups];

    // Remove groups and rules associated with deleted gender rules
    deletedGenderRules.forEach((deletedRule) => {
      // Remove rules that are children of the deleted gender rule
      updatedRules = updatedRules.filter((rule) => rule.parentId !== deletedRule.id);
      // Remove groups associated with the deleted gender rule
      updatedGroups = updatedGroups.filter((group) => group.id !== deletedRule.id);
    });

    // Process each gender rule in the current query
    currentGenderRules.forEach((genderRule) => {
      const newGender = genderRule.value;
      // Skip processing if no gender value is selected
      if (!newGender) return;
      
      // Look for an existing group that's linked to this gender rule
      let existingGroupIndex = updatedRules.findIndex(
        (rule) => rule.rules && rule.combinator && rule.parentId === genderRule.id
      );
      
      if (existingGroupIndex !== -1) {
        // Update the existing gender-specific group
        let existingGroup = updatedRules[existingGroupIndex];
        
        // Ensure all rules in this group have the correct parentId
        const updatedGroupRules = existingGroup.rules.map(rule => ({
          ...rule,
          parentId: existingGroup.id
        }));
        
        // Filter out rules that don't match the current gender
        // (remove cosmetics fields for male and sports fields for female)
        const filteredRules = updatedGroupRules.filter(
          (rule) =>
            (newGender === "male" && rule.field !== "cosmetics") ||
            (newGender === "female" && rule.field !== "sports")
        );
        
        // Update the group with filtered rules
        updatedRules[existingGroupIndex] = {
          ...existingGroup,
          rules: filteredRules
        };
        
        // Check if a default gender-specific rule exists
        const defaultFieldName = newGender === "male" ? "sports" : "cosmetics";
        const ruleExists = filteredRules.some(
          (rule) => rule.field === defaultFieldName
        );
        
        // Add default gender-specific rule if none exists
        // Triggers when gender specific group exists but is missing the expected rule
        if (!ruleExists) {
          updatedRules[existingGroupIndex].rules.push({
            id: uuidv4(),
            field: defaultFieldName,
            operator: "=",
            value: "",
            parentId: existingGroup.id
          });
        }
      }
      // If not gender soecific rule exists
      else {
        // Create a new gender-specific group
        const newGroupId = uuidv4();
        
        // Create the new group with proper parentId reference to the gender rule
        let genderSpecificGroup = {
          id: newGroupId,
          combinator: "and",
          parentId: genderRule.id,  // Link this group to the gender rule
          // For the parent rule
          rules: [
            {
              id: uuidv4(),
              field: newGender === "male" ? "sports" : "cosmetics",
              operator: "=",
              value: "",
              parentId: newGroupId  // This rule belongs to the new group
              // For the parent group
            }
          ]
        };
        
        // Insert the new group right after the gender rule
        let ruleIndex = updatedRules.findIndex((r) => r.id === genderRule.id);
        updatedRules.splice(ruleIndex + 1, 0, genderSpecificGroup);
        
        // Add to groups state with parentId reference
        updatedGroups.push({ 
          id: newGroupId,
          parentId: genderRule.id  // Store relationship to gender rule
        });
      }
    });

    // Update state with our modified rules and groups
    setGroups(updatedGroups);
    setQuery({ ...newQuery, rules: updatedRules });
  };

  // Render the QueryBuilder with our custom components
  return (
    <div>
      <QueryBuilder
        query={query}
        onQueryChange={handleQueryChange}
        controlElements={{
          fieldSelector: FieldSelector,
          valueEditor: CustomValueEditor,
        }}
        context={{ query, groups }}  // Pass query and group state as context to child components.
      />
      <h4>Query</h4>
      <pre>
        <code>{formatQuery(query, "json")}</code>
      </pre>
    </div>
  );
};