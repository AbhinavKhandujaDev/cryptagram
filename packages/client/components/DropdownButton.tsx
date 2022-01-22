import { memo } from "react";

const DropdownButton = memo((props: any) => {
  const {
    View,
    id,
    cls,
    options = [
      { text: "option 1" },
      { text: "option 2" },
      { text: "option 3" },
    ],
  } = props;
  return (
    <div className={`dropdown ${cls}`}>
      <button
        className="btn no-focus"
        type="button"
        id={id} //"dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <View />
      </button>
      <ul
        className="dropdown-menu bg-theme border rounded-3"
        aria-labelledby={id}
      >
        {options.map((o: any) => (
          <li key={o.text}>
            <a className="dropdown-item text-color">{o.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default memo(DropdownButton);
