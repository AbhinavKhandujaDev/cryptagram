import Link from "next/link";
import { memo } from "react";
import PagesOptions from "./PagesOptions";
import { Switch } from "../components";

interface NavbarProps {
  switchTheme?: () => void;
  nightmode?: boolean;
  status?: any;
  user?: any;
}

const Navbar = (props: NavbarProps) => {
  const { switchTheme, nightmode, status, user } = props;
  return (
    <nav
      style={{ height: "55px" }}
      className="flex-center-h w-100 bg-theme px-4 position-fixed border-bottom justify-content-between flex-grow-1"
    >
      <Link href="/feeds">
        <label style={{ width: "150px" }} className="fw-bold fs-4 pointer me-5">
          Cryptagram
        </label>
      </Link>
      {/* <div className="pages-options-container d-none d-md-flex flex-center-h px-5 col-7">
        <PagesOptions status={status} user={user} />
      </div> */}
      <div className="flex-center-h justify-content-between mx-3 w-75">
        <div className="flex-center-h justify-content-start border rounded-3 px-2 py-1">
          <i className="bi bi-search text-color position-absolute" />
          <input
            className="no-focus bg-transparent border-0 text-color flex-center-h ps-4 w-100"
            placeholder="Search..."
          />
        </div>
        <PagesOptions status={status} user={user} cls="d-none d-md-flex w-50" />
      </div>
      <div className="flex-center-h justify-content-end">
        <Switch isOn={nightmode} onSwitch={switchTheme} />
      </div>
    </nav>
  );
};

export default memo(Navbar);
