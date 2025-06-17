import React from "react";
import styles from "./Dropdown.module.css"; // You can style this as needed

function Dropdown({
                              label,
                              options,
                              selected,
                              onAdd,
                              onRemove,
                              labelKey = "name",
                              valueKey = "id",
                          }) {
    const availableOptions = options.filter(
        opt => !selected.includes(opt[valueKey])
    );

    return (
        <div className={styles.FilterCon}>
            <label>{label}</label>
            <select onChange={(e) => {
                if (e.target.value) {
                    onAdd(isNaN(e.target.value) ? e.target.value : Number(e.target.value));

                    e.target.value = "";
                }
            }}>
                <option value="">Select {label}</option>
                {availableOptions.map(opt => (
                    <option key={opt[valueKey]} value={opt[valueKey]}>
                        {opt[labelKey]}
                    </option>
                ))}
            </select>
            <div className={styles.ItemCon}>
                {selected.map((val, i) => {
                    const fullLabel = options.find(opt => String(opt[valueKey]) === String(val))?.[labelKey] ?? val;
                    return (
                        <div key={i} className={styles.ItemBox} onClick={() => onRemove(val)}>
                            {fullLabel} &times;
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Dropdown;
