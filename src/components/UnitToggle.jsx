const OPTIONS = [
  { value: "metric", label: "°C" },
  { value: "imperial", label: "°F" },
];

function UnitToggle({ units, onChange }) {
  return (
    <div className="unit-toggle" role="group" aria-label="Units">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="unit-button"
          aria-pressed={units === option.value}
          onClick={() => onChange(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default UnitToggle;
