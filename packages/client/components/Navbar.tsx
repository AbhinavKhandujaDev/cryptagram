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
      style={{ height: "50px" }}
      className="flex-center-h w-100 bg-theme px-4 position-fixed border-bottom justify-content-between"
    >
      <Link href="/feeds">
        <label style={{ width: "150px" }} className="fw-bold fs-4">
          Cryptagram
        </label>
      </Link>
      <div className="pages-options-container d-none d-md-flex flex-center-h px-5 col-7">
        <PagesOptions status={status} user={user} />
      </div>
      <div style={{ width: "150px" }} className="d-flex justify-content-end">
        <Switch isOn={nightmode} onSwitch={switchTheme} />
      </div>
    </nav>
  );
};

export default memo(Navbar);
