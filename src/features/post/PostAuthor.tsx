


import React from 'react'
import { useSelector } from 'react-redux'
import { selectAllUsers } from '../user/UserSlice'
import { Link } from 'react-router-dom';


function PostAuthor({userId}:{userId:string}) {
    console.log('userId',userId);
    const users = useSelector(selectAllUsers);
   console.log(users);
    const author = users.find(user=> user.id === userId);
    console.log('author',author)
    return <span>By {author? <Link to={`/user/${userId}`}>
     {author.name}
    </Link>:'Unknown Author'}</span>
}

export default React.memo(PostAuthor);
