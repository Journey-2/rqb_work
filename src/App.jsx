import { useState } from "react";
import { QueryBuilder, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import "./styles.css";
import { initialQuery, baseFields, menHobbies, womenHobbies } from "./Fields";

export const App = () => {
  //state to store the current query structure
  const [query, setQuery] = useState(initialQuery);

  //query: 
  // {
  //   "combinator": "and",
  //   "rules": [
  //     { "field": "gender", "operator": "=", "value": "male" }
  //   ]
  // }

  //state to store the selected gender, either "male" or "female"
  const [selectedGender, setSelectedGender] = useState(""); //string male or female

  //function that handles changes in the query builder
  const handleQueryChange = (newQuery) => {
    
    //newQuery :
    // {
    //   "combinator": "and",
    //   "rules": [
    //     { "field": "gender", "operator": "=", "value": "female" }
    //   ]
    // }

    //find the rule that corresponds to the "gender" field in the query
    const genderRuleIndex = newQuery.rules.findIndex((rule) => rule.field === "gender");
    const genderRule = newQuery.rules[genderRuleIndex];

    //{ "field": "gender", "operator": "=", "value": "male" } and undefined if no gender rule exists

    //if there's no gender rule, reset selectedGender and update the query as it is
    if (genderRuleIndex === -1) {
      setSelectedGender("");
      setQuery(newQuery);
      return;
    }

    
    //get the selected gender value from the query
    const newGender = genderRule.value; //string. male/female

    setSelectedGender(newGender);

    //don't display group before choosing gender
    if (!newGender) {
      setQuery(newQuery);
      return;
    }

    //find an existing gender-specific group (if any)
    let existingGroupIndex = newQuery.rules.findIndex(
      (rule) =>
        rule.rules &&
        (rule.rules.some((r) => r.field === "sports") ||
         rule.rules.some((r) => r.field === "cosmetics"))
    );

    let updatedRules = [...newQuery.rules];

    if (existingGroupIndex !== -1) {
      // Preserve user-added rules inside the gender-specific group
      updatedRules[existingGroupIndex] = {
        ...updatedRules[existingGroupIndex],
        rules: [
          ...updatedRules[existingGroupIndex].rules.filter(
            (r) => (newGender === "male" ? r.field !== "cosmetics" : r.field !== "sports")
          )
        ]
      };

      //ensures we only add the new gender-specific rule if it does not already exist
      const ruleExists = updatedRules[existingGroupIndex].rules.some(
        (r) => r.field === (newGender === "male" ? "sports" : "cosmetics")
      );

      if (!ruleExists) {
        updatedRules[existingGroupIndex].rules.push(
          newGender === "male"
            ? { field: "sports", operator: "=", value: "" }
            : { field: "cosmetics", operator: "=", value: "" }
        );
      }
    } else {
      //if no existing gender-specific group, create a new one
      let genderSpecificGroup = {
        combinator: "and",
        rules: [
          newGender === "male"
            ? { field: "sports", operator: "=", value: "" }
            : { field: "cosmetics", operator: "=", value: "" }
        ]
      };

      updatedRules.splice(genderRuleIndex + 1, 0, genderSpecificGroup);
    }

    //update the query state with the modified rules
    setQuery({ combinator: "and", rules: updatedRules });

    console.log("Updated Query:", updatedRules);
    console.log("New Gender:", newGender);
    
  };

  //dynamically determine which fields to show based on the selected gender
  const dynamicFields = [
    ...baseFields,
    ...(selectedGender === "male" ? menHobbies : []), // If male, include men's hobbies
      // [
      //   { "name": "gender", "label": "Gender", "type": "string" },
      //   { "name": "sports", "label": "Sports", "type": "string" }
      // ]
    ...(selectedGender === "female" ? womenHobbies : []), // If female, include women's hobbies
      // [
      //   { "name": "gender", "label": "Gender", "type": "string" },
      //   { "name": "cosmetics", "label": "Cosmetics", "type": "string" }
      // ]
  ];

  return (
    <div>
      <QueryBuilder fields={dynamicFields} query={query} onQueryChange={handleQueryChange} />
      <h4>Query</h4>
      <pre>
        <code>{formatQuery(query, "json")}</code>
      </pre>
    </div>
  );
};
