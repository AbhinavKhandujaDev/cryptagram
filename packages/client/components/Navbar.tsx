import Link from "next/link";
import router from "next/router";
import { memo, useState } from "react";
import PagesOptions from "./PagesOptions";
import { Switch, SegmentView } from "../components";

interface NavbarProps {
  switchTheme?: () => void;
  nightmode?: boolean;
  status?: any;
  user?: any;
  isNFT?: boolean;
}

const Navbar = (props: NavbarProps) => {
  const { switchTheme, nightmode, status, user, isNFT } = props;
  const [nftNavNum, setNftNavNum] = useState<number>(0);
  return (
    <nav
      // style={{ height: "55px" }}
      className="flex-center-v w-100 bg-theme position-fixed border-bottom justify-content-between flex-grow-1"
    >
      <div className="flex-center-h w-100 bg-theme px-4 py-2 justify-content-between">
        <Link href="/feeds">
          <label
            style={{ width: "150px" }}
            className="fw-bold fs-4 pointer me-5"
          >
            Cryptagram
          </label>
        </Link>
        <div className="flex-center-h justify-content-between mx-3 w-75">
          <div className="flex-center-h justify-content-start border rounded-3 px-2 py-1">
            <i className="bi bi-search text-color position-absolute" />
            <input
              className="no-focus bg-transparent border-0 text-color flex-center-h ps-4 w-100"
              placeholder="Search..."
            />
          </div>
          <PagesOptions
            status={status}
            user={user}
            cls="d-none d-md-flex w-50"
          />
        </div>
        <div className="flex-center-h justify-content-end">
          <Switch
            switchOnElement="☀️"
            switchOffElement="☾"
            isOn={nightmode}
            onSwitch={switchTheme}
          />
        </div>
      </div>
      {/* {isNFT && (
        <>
          <div className="border-bottom" />
          <div className="px-3">
            <SegmentView
              cls="col-12 py-4"
              sliderType="underline"
              selected={nftNavNum}
              opts={["Market", "Collected", "Created", "Create"]}
              onSelect={(index: number) => {
                setNftNavNum(index);
                router.push("/nft/market");
              }}
            />
          </div>
        </>
      )} */}
    </nav>
  );
};

export default memo(Navbar);
