import { useState } from "react";
import { QueryBuilder, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { ValueSelector, ValueEditor } from "react-querybuilder";
import { initialQuery, baseFields, menHobbies, womenHobbies } from "./Fields";

// Custom Field Selector: Shows different fields at different levels
const FieldSelector = (props) => {
  const ruleLevel = props.path.length; // Determines depth level

  let availableFields = baseFields;

  if (ruleLevel > 1) {
    availableFields =
      props.context.selectedGender === "male" ? menHobbies : womenHobbies;
  }

  return <ValueSelector {...props} options={availableFields} />;
};

// Custom Value Editor: Uses dropdown if field has predefined values
const CustomValueEditor = (props) => {
  const field = props.field;
  const fieldData = [...baseFields, ...menHobbies, ...womenHobbies].find(
    (f) => f.name === field
  );

  if (!fieldData) {
    return <ValueEditor {...props} />;
  }

  if (fieldData.values) {
    return (
      <select
        value={props.value}
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

  return <ValueEditor {...props} />;
};

export const App = () => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedGender, setSelectedGender] = useState("");

  const handleQueryChange = (newQuery) => {
    const genderRuleIndex = newQuery.rules.findIndex(
      (rule) => rule.field === "gender"
    );
    const genderRule = newQuery.rules[genderRuleIndex];

    const newGender = genderRule ? genderRule.value : "";

    setSelectedGender(newGender);

    if (!newGender) {
      setQuery(newQuery);
      return;
    }

    // Check if a group already exists
    const existingGroupIndex = newQuery.rules.findIndex(
      (rule) => rule.rules && rule.combinator
    );

    let updatedRules = [...newQuery.rules];

    if (existingGroupIndex !== -1) {
      updatedRules[existingGroupIndex] = {
        ...updatedRules[existingGroupIndex],
        rules: [
          ...updatedRules[existingGroupIndex].rules.filter(
            (r) =>
              (newGender === "male" && r.field !== "cosmetics") ||
              (newGender === "female" && r.field !== "sports")
          ),
        ],
      };

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
      let genderSpecificGroup = {
        combinator: "and",
        rules: [
          newGender === "male"
            ? { field: "sports", operator: "=", value: "" }
            : { field: "cosmetics", operator: "=", value: "" },
        ],
      };

      updatedRules.splice(genderRuleIndex + 1, 0, genderSpecificGroup);
    }

    setQuery({ combinator: "and", rules: updatedRules });
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
        context={{ selectedGender }}
      />
      <h4>Query</h4>
      <pre>
        <code>{formatQuery(query, "json")}</code>
      </pre>
    </div>
  );
};
