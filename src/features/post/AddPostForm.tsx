import { useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, addNewPost } from "./PostSlice";
import { selectAllUsers } from "../user/UserSlice";
import { AppDispatch } from "../../app/store";


const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequest, setAddRequest] = useState("idle");
  const dispatch = useDispatch<AppDispatch>();
  const userList = useSelector(selectAllUsers);

  const titleHandler = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setTitle(e.target.value);
  }
  
  //const canSave = Boolean(title) && Boolean(content) && Boolean(userId);
  const canSave = [title,content,userId].every(Boolean) && addRequest ==='idle';

  const contentHandler = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
    setContent(e.target.value);
  }
  const selectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => setUserId(e.target.value);
  
  const saveHandler = async ()=>{
    // if(content && title){
    //     dispatch(addPost(title,content,userId));
    //     setTitle('');
    //     setContent('');
    //     setUserId('');
    // }
    if(canSave){
      try{
        setAddRequest('pending');
       await dispatch(addNewPost({title,body:content,userId})).unwrap();
        setTitle('');
        setContent('');
        setUserId('');
      }catch(e){
        console.log('server#',e);
      }finally{
        setAddRequest('idle');
      }
    }
  }

  const UserListOption = userList?.map(user=>(
    <option key={user.id} value={user.id}>{user.name}</option>
  ));
  return (
    <>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <h2 className="text-base/7 font-semibold text-white">Profile</h2>
          <p className="mt-1 text-sm/6 text-gray-400">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label className="block text-sm/6 font-medium text-white">
                title
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={titleHandler}
                    placeholder="janesmith"
                    className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label className="block text-sm/6 font-medium text-white">
                Author
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                  <select
                    id="Author"
                    value={userId}
                    onChange={selectHandler}
                    className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                  >
                    <option value="">Select Author</option>
                    {UserListOption}
                    </select>
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <label className="block text-sm/6 font-medium text-white">
                Body
              </label>
              <div className="mt-2">
                <textarea
                  id="content"
                  name="content"
                  onChange={contentHandler}
                  value={content}
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button  type="button" className="text-sm/6 font-semibold text-white">
          Cancel
        </button>
        <button
          disabled={!canSave}
         onClick={saveHandler}
         className="rounded-md bg-red-800 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Save
        </button>
      </div>
    </>
  );
};

export default AddPostForm;
