// "use client";

// import { useFormStatus } from "react-dom";

// const AddpostButton = () => {
//   const { pending } = useFormStatus();

//   return (
//     <button
//       className={`
//         text-white
//         bg-blue-600
//         disabled:bg-gray-400
//         disabled:cursor-not-allowed
//         px-4 py-2
//         rounded-md
//         font-semibold
//         transition-colors
//         duration-200
//         hover:bg-blue-700
//         focus:outline-none
//         focus:ring-2
//         focus:ring-blue-500
//       `}
//       disabled={pending}
//       aria-busy={pending} // For screen readers
//       aria-label={pending ? "Sending post" : "Send post"}
//     >
//       {pending ? (
//         <div className="flex items-center gap-2">
//           {/* Custom Spinner (Replace with your preferred spinner) */}
//           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//           Sending
//         </div>
//       ) : (
//         "Send"
//       )}
//     </button>
//   );
// };

// export default AddpostButton;

"use client";
import { useFormStatus } from "react-dom";

const AddPostButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-white bg-blue-600 disabled:bg-gray-400 px-4 py-2 rounded-md font-semibold hover:bg-blue-700"
    >
      {pending ? "Sending..." : "Send"}
    </button>
  );
};

export default AddPostButton;
