import Link from "next/link";
import { memo } from "react";
import PagesOptions from "./PagesOptions";

interface NavbarProps {
  switchTheme?: () => void;
  nightmode?: boolean;
  status?: any;
}

const Navbar = (props: NavbarProps) => {
  const { switchTheme, nightmode, status } = props;
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
      <div className="pages-options-container d-none d-md-flex flex-center-h px-5 w-50">
        <PagesOptions status={status} />
      </div>
      <div
        style={{ width: "150px" }}
        className="flex-center-h justify-content-end"
      >
        <label
          className="flex-center-h h-100 pointer"
          onClick={() => switchTheme && switchTheme()}
        >
          {nightmode ? "☾" : "☀️"}
        </label>
      </div>
    </nav>
  );
};

export default memo(Navbar);
