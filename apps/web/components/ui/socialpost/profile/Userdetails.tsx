// "use client";
import React from "react";
import { Button } from "../../form/button";
import { login } from "~/app/server/next-auth-v5";
import { auth } from "~/auth";
import { db } from "~/lib/prisma";
import { BlockReason } from "@google/generative-ai";
import Userdetailsinteraction from "./UserdetailsInteraction";

interface proftype {
  name: string;
  email: string;
  image: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

const Userdetails = async ({
  loginid,
  viewid,
  currentuser,
  prof,
}: {
  loginid: string;
  viewid: string;
  currentuser: string;
  prof: proftype;
}) => {
  // console.log(
  //   "Indisde userdetails loginid ",
  //   loginid,
  //   " and viewid ",
  //   viewid,
  //   " and current user is ",
  //   currentuser
  // );

  if (currentuser === "currentuser" || loginid === viewid) return null;

  let isUserBlocked = false;
  let isFollowing = false;
  let isFollowingSent = false;

  const userid = loginid;

  if (userid) {
    const blockRes = await db.block.findFirst({
      //Block check
      where: {
        blockerId: loginid,
        blockedId: viewid,
      },
    });
    isUserBlocked = !!blockRes;

    const followRes = await db.follower.findFirst({
      where: {
        followerId: loginid,
        followingId: viewid,
      },
    });
    isFollowing = !!followRes;

    const followReqRes = await db.followRequest.findFirst({
      where: {
        senderId: loginid,
        receiverId: viewid,
      },
    });

    isFollowingSent = !!followReqRes;
  }

  return (
    <div>
      <Userdetailsinteraction
        loginid={loginid}
        viewid={viewid}
        isUserBlocked={isUserBlocked}
        isFollowing={isFollowing}
        isFollowingSent={isFollowingSent}
      />
    </div>
  );
};

export default Userdetails;
