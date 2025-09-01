import React from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'




function TimeAgo({timestamp}: {timestamp:string}) {
 let timeAgo = '';
 if(timestamp){
    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago`;
 }
    return (
    <p title={timestamp}>
       <i>{timeAgo}</i>
    </p>
  )
}

export default React.memo(TimeAgo);
