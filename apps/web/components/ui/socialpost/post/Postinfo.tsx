// "use client";
// import Image from "next/image";
// import { useState } from "react";
// import { deletePost } from "~/app/server/social/post/action";

// const Postinfo = ({ postId }: { postId: number }) => {
//   const [open, setOpen] = useState(false);
//   const deletepostwithid = deletePost.bind(null, postId);
//   return (
//     <div className="relative">
//       <Image
//         src="/socialimg/more.png"
//         alt=""
//         width={16}
//         height={16}
//         onClick={() => setOpen((prev) => !prev)}
//         className="cursor-pointer"
//       />
//       {open && (
//         <div className="absolute top-4 right-0 bg-red-600 p-2 rounded-lg flex flex-col gap-2 text-xs shasow-lg z-30">
//           {/* <span className="cursor-pointer">View</span>
//             <span className="cursor-pointer">Re-post</span> */}
//           <form action={deletepostwithid}>
//             <button className="text-white bold">
//               Delete
//               <br />
//               <Image
//                 src="/socialimg/delete.png"
//                 width={20}
//                 height={20}
//                 alt=""
//               ></Image>
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };
// export default Postinfo;

"use client";
import Image from "next/image";
import { useState } from "react";
import { deletePost } from "~/app/actions/social/post/action";

const Postinfo = ({ postId }: { postId: number }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const deletepostwithid = deletePost.bind(null, postId);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    deletepostwithid();
    setShowConfirmation(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleDelete}
        className=" rounded-lg flex items-center gap-2 text-white"
        aria-label="Delete post"
      >
        <Image src="/socialimg/delete.png" width={20} height={20} alt="" />
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-500 p-6 rounded-lg">
            <p>Are you sure you want to delete this post?</p>
            <div className="flex justify-end mt-4 gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Postinfo;
