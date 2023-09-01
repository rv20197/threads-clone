"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  userType: string;
};

const UserCard = ({ id, name, username, imgUrl, userType }: Props) => {
  const router = useRouter();
  const isCommunity = userType === "Community";
  const onClickHandler = () => {
    if (isCommunity) {
      router.push(`/communities/${id}`);
    } else {
      router.push(`/profile/${id}`);
    }
  };
  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <div className="relative h-12 w-12">
          <Image
            src={imgUrl}
            alt="logo"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>
      <Button className="user-card_btn" onClick={onClickHandler}>
        View
      </Button>
    </article>
  );
};

export default UserCard;
