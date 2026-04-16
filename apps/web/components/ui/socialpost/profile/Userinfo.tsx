"use client";
import Image from "next/image";
import React from "react";

interface usertype {
  name: string;
  email: string;
  image: string;
  _count: {
    posts: number;
    arenas: number;
    followers: number;
    followings: number;
  };
  profile: {
    city: string | null;
    address: string | null;
  } | null;
}

const Userinfo = ({ userData }: { userData: usertype }) => {
  return (
    <div className="flex flex-col items-center p-2">
      <div className="w-full h-56 relative">
        <Image
          src={userData.image}
          width={128}
          height={128}
          alt=""
          className="w-32 h-32 rounded-full absolute left-0 right-0 m-auto -bottom-16 ring ring-white object-cover"
        />
      </div>
      <h1 className="mt-20 mb-4 text-2xl font-semibold">{userData.name}</h1>

      <div className="flex justify-center gap-12 mb-4">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{userData._count.posts}</span>
          <span className="text-sm">Posts</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{userData._count.arenas}</span>
          <span className="text-sm">Arenas</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">
            {userData._count.followings}
          </span>
          <span className="text-sm">Followers</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{userData._count.followers}</span>
          <span className="text-sm">Followings</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-12">
        <div className="flex flex-col items-center ">
          <span className="text-lg font-bold">
            {userData.profile?.city ? userData.profile.city : "Not defined"}
          </span>
          <span className="text-sm">City</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">
            {userData.profile?.address
              ? userData.profile.address
              : "Not defined"}
          </span>
          <span className="text-sm">Address</span>
        </div>
      </div>
    </div>
  );
};

export default Userinfo;

// "use client";
// import Image from "next/image";
// import React from "react";

// const Userinfo = () => {
//   return (
//     <div className="flex flex-col items-center rounded-lg p-6">
//       {/* Cover Image */}
//       <div className="w-full h-48 relative rounded-md ">
//         <Image
//           src="https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
//           className="object-cover"
//           fill
//           alt="Cover Image"
//         />
//       </div>

//       {/* Profile Picture */}
//       <div className="relative -mt-16">
//         <Image
//           src="https://images.pexels.com/photos/10745847/pexels-photo-10745847.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load"
//           width={128}
//           height={128}
//           alt="Profile Picture"
//           className="w-32 h-32 rounded-full ring-4 ring-white object-cover"
//         />
//       </div>

// {/* User Name */}
// <h1 className="mt-4 text-2xl font-semibold text-gray-900">Albert Einstein</h1>

// {/* Stats Section */}
// <div className="flex justify-center gap-12 mt-4">
//   <div className="flex flex-col items-center">
//     <span className="text-lg font-bold text-gray-800">123</span>
//     <span className="text-sm text-gray-500">Posts</span>
//   </div>
//   <div className="flex flex-col items-center">
//     <span className="text-lg font-bold text-gray-800">1.2k</span>
//     <span className="text-sm text-gray-500">Followers</span>
//   </div>
//   <div className="flex flex-col items-center">
//     <span className="text-lg font-bold text-gray-800">32</span>
//     <span className="text-sm text-gray-500">Following</span>
//   </div>
// </div>

// {/* Follow Button */}
// <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
//   Follow
// </button>

//     </div>
//   );
// };

// export default Userinfo;
