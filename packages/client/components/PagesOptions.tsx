import { memo } from "react";
import Link from "next/link";
import Image from "next/image";

const NavIcon = memo((props: any) => {
  const { imagePath, to, imageClass, selected, size = 28 } = props;
  return (
    <Link href={to}>
      <Image
        width={size}
        height={size}
        src={`/images/${imagePath + selected}.png`}
        className={`${imageClass} pointer`}
      />
    </Link>
  );
});

function PagesOptions(props: any) {
  const { status, showPost = false } = props;
  return (
    <div className="PagesOptions flex-center-h justify-content-between col-12">
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
      {showPost && (
        <NavIcon
          to="/create"
          text="Create"
          imagePath="add"
          imageClass="p-1"
          selected={status?.create}
        />
      )}
      <NavIcon to="/nft" text="NFT" imagePath="nft" selected={status?.nft} />
      <NavIcon
        to="/profile/abhi123"
        text="Profile"
        imagePath="user"
        selected={status?.profile}
      />
    </div>
  );
}

export default memo(PagesOptions);
