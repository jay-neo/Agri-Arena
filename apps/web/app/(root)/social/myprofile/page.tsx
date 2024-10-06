import ProfileForm from "./Profile";
import { getProfile } from "~/app/server/user";

export default async () => {
  const myprofile: Profile = await getProfile();
  console.log();
  return (
    <div>
      <div className="max-w-full">
        <div className="flex flex-row items-center justify-center mt-10 ">
          <div className="backdrop-blur-3xl m-2 md:mt-10 p-4 min-w-96 w-[25rem] md:w-[30rem] h-[40rem] border-2 border-black dark:border dark:border-white rounded-lg">
            <ProfileForm myprofile={myprofile} />
          </div>
        </div>
      </div>
    </div>
  );
};

// https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg
