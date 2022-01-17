import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

interface NavbarProps {
  switchTheme?: () => void;
  nightmode?: boolean;
  status?: any;
}

const lightIcon = "https://img.icons8.com/fluency/48/000000/sun.png";

const darkIcon =
  "https://img.icons8.com/external-bearicons-detailed-outline-bearicons/64/000000/external-moon-halloween-bearicons-detailed-outline-bearicons.png";

const NavIcon = memo((props: any) => {
  const { imagePath, to, text, imageClass, selected } = props;
  return (
    <Link href={to}>
      <div className={`flex-center-c pointer`}>
        <Image
          width={25}
          height={25}
          src={`/images/${imagePath + selected}.png`}
          className={imageClass}
        />
        {/* <label
          className={`${
            selected === "-selected" ? "text-primary" : "text-muted"
          } fw-bold`}
        >
          {text}
        </label> */}
      </div>
    </Link>
  );
});

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
      <div className="flex-center-h d-none d-md-flex justify-content-between col-6">
        <NavIcon
          to="/feeds"
          text="Feeds"
          imagePath="feed"
          selected={status?.feeds}
        />
        <NavIcon
          to="/wallet"
          text="Wallet"
          imagePath="wallet"
          selected={status?.wallet}
        />
        <NavIcon to="/nft" text="NFT" imagePath="nft" selected={status?.nft} />
        <NavIcon
          to="/profile"
          text="Profile"
          imagePath="user"
          selected={status?.profile}
        />
      </div>
      <div
        style={{ width: "150px" }}
        className="flex-center-h justify-content-end"
      >
        {/* <Switch
          autoFocus={false}
          checked={nightmode || false}
          onChange={() => switchTheme && switchTheme()}
          onColor={`${nightmode ? "#888888" : "#f6d379"}`}
          onHandleColor={`${nightmode ? "#000000" : "#f6d379"}`}
          handleDiameter={18}
          checkedIcon={<label className="flex-center-h h-100">☾</label>}
          uncheckedIcon={<label className="flex-center-h h-100">☀️</label>}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={24}
          width={45}
          className="react-switch"
          id="theme-switch"
        /> */}
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
