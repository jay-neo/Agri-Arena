import { getProfileById } from "~/app/server/user/profile";
import { ProfileForm } from "~/components/ui/Profile";

export default async ({ params }: { params: { id: string } }) => {
  const myprofile: Profile = await getProfileById(params.id);
  return (
    <>
      <div>
        <div className="max-w-full">
          <div className="flex flex-row items-center justify-center mt-10 ">
            <div className="backdrop-blur-3xl m-2 md:mt-10 p-4 min-w-96 w-[25rem] md:w-[30rem] h-[40rem] border-2 border-black dark:border dark:border-white rounded-lg">
              <ProfileForm myprofile={myprofile} privateMode />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
