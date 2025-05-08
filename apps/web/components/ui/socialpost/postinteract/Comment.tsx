// "use client"
import React, { useEffect, useState } from "react";
import { db } from "~/lib/prisma";
import { getComments } from "~/app/server/social/post/action";
import { getUser } from "~/app/server/user";
import CommentList from "./CommentList";
import CommentClient from "./CommentClient";
// import Comments from './Comments'

const Comment = async ({id,postId}:{id:string;postId:number}) => {
  const user = await getUser();
  
  
  const comments = await db.comment.findMany({
    where:{
      postId,
    },
    include:{
      user:true
    }
  })



  
  return (
    <div>
      <CommentClient user={user} postId={postId} comments={comments}/>
{/* postId={postId} */}
    </div>
  );
};

export default Comment;

  // {postId}:{postId:number}














// "use client";
// import React, { useEffect, useState } from "react";
// import CommentList from "./CommentList";
// import { getUser } from "~/app/server/user";

// const Comment = ({ id, postId }: { id: string; postId: number }) => {
//     const [user, setUser] = useState(null);
//     const [comments, setComments] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//       const fetchData = async () => {
//           // ... other code ...

//           try {
//               console.log("Fetching comments for postId:", postId); // Debugging
//               const response = await fetch(`/api/comments?postId=${postId}`);
//               console.log("Response status:", response.status); // Debugging

//               if (!response.ok) {
//                   throw new Error(`Failed to fetch comments: ${response.statusText}`);
//               }
//               const fetchedComments = await response.json();
//               setComments(fetchedComments);
//           } catch (err) {
//               // ... error handling ...
//           }
//       };

//       fetchData();
//   }, [postId]);

//     if (loading) {
//         return <div>Loading comments...</div>;
//     }

//     if (error) {
//         return <div>Error loading comments: {error.message || "An unexpected error occurred."}</div>;
//     }

//     if (!user || !comments) {
//         return <div>There was an error loading the comments.</div>;
//     }

//     return (
//         <div>
//             <CommentList user={user} postId={postId} comments={comments} />
//         </div>
//     );
// };

// export default Comment;