import React from "react";
import { useDispatch } from "react-redux";
import { addReaction } from "./PostSlice";

const reactionEmoji = {
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};
const ReactionBtn = ({post}: {post: any}) =>{
  const dispatch = useDispatch();
  const reactionsButtons = Object.entries(reactionEmoji).map(([name,emoji])=>{
    return (
        <button 
        key={name}
         type="button" className="" 
         onClick={()=>dispatch(addReaction({postId:post.id,reaction:name}))}>
            {emoji} {post.reactions[name]}
        </button>
    )
  });
  return( <div>{reactionsButtons}</div>);
}

export default React.memo(ReactionBtn);
