import { memo } from "react";

const DropdownButton = memo((props: any) => {
  const { View, id } = props;
  return (
    <div className="dropdown">
      <button
        className="btn no-focus"
        type="button"
        id={id} //"dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <View />
      </button>
      <ul className="dropdown-menu" aria-labelledby={id}>
        <li>
          <a className="dropdown-item" href="#">
            Action
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            Another action
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            Something else here
          </a>
        </li>
      </ul>
    </div>
  );
});

export default memo(DropdownButton);
