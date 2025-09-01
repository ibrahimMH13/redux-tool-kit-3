import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCount, incerateCount } from "../../features/post/PostSlice";
const Header = () => {
  const dispatch = useDispatch();
  
  const count = useSelector(getCount);

  return (
    <header
      className="w-full flex justify-between items-center 
    p-4 bg-red-600 text-white shadow-md"
    >
      <h1 className="text-2xl font-bold">Redux Header</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">
              HOME
            </Link>
          </li>
          <li>
            <Link to="post" className="hover:underline">
              Post
            </Link>
          </li>
          <li>
            <Link to="user" className="hover:underline">
              users
            </Link>
          </li>
        </ul>
        <button onClick={()=>{dispatch(incerateCount())}}>
          {count}
        </button>
      </nav>
    </header>
  );
};
export default React.memo(Header);
