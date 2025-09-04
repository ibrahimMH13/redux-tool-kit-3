import React, { useState } from "react";

const reactionEmoji = {
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionBtn = ({post}: {post: any}) =>{
  const [reactions, setReactions] = useState(post.reactions || {
    wow: 0,
    heart: 0,
    rocket: 0,
    coffee: 0,
  });

  const handleReaction = (reactionName: string) => {
    setReactions(prev => ({
      ...prev,
      [reactionName]: (prev[reactionName] || 0) + 1
    }));
  };

  const reactionsButtons = Object.entries(reactionEmoji).map(([name,emoji])=>{
    return (
        <button 
        key={name}
         type="button" className="" 
         onClick={()=>handleReaction(name)}>
            {emoji} {reactions[name]}
        </button>
    )
  });
  return( <div>{reactionsButtons}</div>);
}

export default React.memo(ReactionBtn);
