// "use client"
// import Image from "next/image";
// import { useState } from "react";
// import AddpostButton from "./AddpostButtton";
// import { addPosts } from "~/app/server/social/post/action";
// interface UserType {
//   id: string;
//   name: string | null;
//   email: string | null;
//   image: string | null;
// }

// const AddPost = ({user}:{user:UserType}) => {
//   const [Desc,setDesc] = useState("");
//   const [img,setimg] = useState<any>();
//   const handleSubmit = async (formData: FormData) => {
//     const result = await addPosts(formData);
//     if (result && result.success) {
//       setTimeout(() => {
//           setDesc("");
//       }, 1);
//   }
// };

//   return (
//     <div className="p-4 bg-white bg-white dark:bg-[#2A2A4F] border border-gray-300 dark:border-gray-600 rounded-lg flex gap-4 justify-between text-sm">
//       {/* avatar */}
//       <Image
//         src={user.image || "/socialimg/noAvatar.png"}
//         alt=""
//         width={48}
//         height={48}
//         className="w-12 h-12 object-cover rounded-full"
//       />
//       {/* post */}
//       <div className="flex-1">
//         {/* text-inputs */}
//         <form action={handleSubmit} className="flex gap-4">
//           <textarea
//             placeholder="What is in your mind"
//             className="flex-1 rounded-lg p-4 bg-gray-200 dark:bg-gray-700"
//             name="desc"
//             value={Desc}
//             onChange={(e)=>setDesc(e.target.value)}
//           ></textarea>
//           <div className=""><br />
//           <AddpostButton/>
//           </div>
//         </form>
//         {/* post options */}
//         <div className="flex items-center gap-4 mt-4 flex-wrap">
//           <div className="flex items-center gap-2 cursor-pointer">
//             <Image src="/socialimg/addimage.png" alt="" width={20} height={20} />
//             Photo
//           </div>
//           <div className="flex items-center gap-2 cursor-pointer">
//             <Image src="/socialimg/addvideo.png" alt="" width={20} height={20} />
//             video
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default AddPost;

"use client";
import Image from "next/image";
import { useState, useRef, ChangeEvent } from "react";
import { addPostsWithImage } from "./action";
import AddpostButton from "./AddpostButtton";
import { useRouter } from "next/navigation";

interface UserType {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

const AddPost = ({ user }: { user: UserType }) => {
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      file.size < 2000000 &&
      /image\/(jpeg|jpg|png)/.test(file.type)
    ) {
      setImageFile(file);
    } else {
      alert("Invalid image. Must be jpg/png and < 2MB.");
    }
  };

  const router = useRouter();
  const handleSubmit = async (formData: FormData) => {
    if (imageFile) {
      formData.set("image", imageFile);
    }
    formData.set("desc", desc);
    await addPostsWithImage(formData);
    setDesc("");
    setImageFile(null);
    router.refresh();
  };

  return (
    <div className="p-4 bg-white dark:bg-[#2A2A4F] border rounded-lg flex gap-4 text-sm">
      {/* User Avatar */}
      <Image
        src={user.image || "/socialimg/noAvatar.png"}
        alt="Avatar"
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />

      {/* Content Area */}
      <div className="flex-1">
        <form action={handleSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2 items-start">
            {/* Text Area */}
            <textarea
              name="desc"
              placeholder="What's on your mind?"
              className="flex-1 rounded-lg p-3 bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            {/* Small Send Button */}
            <div className="pt-1">
              <AddpostButton />
            </div>
          </div>

          {/* Image Preview */}
          {imageFile && (
            <div className="mt-1">
              <Image
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                width={180}
                height={180}
                className="rounded-md object-contain max-h-48"
              />
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Photo Option */}
          <div
            className="flex items-center gap-2 cursor-pointer text-blue-500 hover:underline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image
              src="/socialimg/addimage.png"
              alt="Add"
              width={20}
              height={20}
            />
            Photo
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
