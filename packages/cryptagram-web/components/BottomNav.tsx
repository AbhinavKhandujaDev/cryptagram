import Link from "next/link";
import { memo } from "react";

const BottomNav = memo((props: any) => {
  const { status, ...divProps } = props;
  return (
    <div {...divProps}>
      <Link href="feeds">
        <img
          width="30px"
          className="ratio-eq pointer"
          src={`./images/feed${status?.feeds}.png`}
        />
      </Link>
      <Link href="wallet">
        <img
          width="30px"
          className="ratio-eq pointer"
          src={`./images/wallet${status?.wallet}.png`}
        />
      </Link>
      <Link href="create">
        <img
          width="30px"
          className="ratio-eq p-1 pointer"
          src={`./images/add${status?.create}.png`}
        />
      </Link>
      <img width="30px" className="ratio-eq pointer" src="./images/nft.png" />
      <Link href="profile">
        <img
          width="30px"
          className="ratio-eq pointer"
          src={`./images/user${status?.profile}.png`}
        />
      </Link>
    </div>
  );
});

export default BottomNav;
