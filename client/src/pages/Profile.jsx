import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signInFailure,
  signInSuccess,
  signOutStart,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/user/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className=" p-4 max-w-lg mx-auto">
      <h1 className=" text-3xl font-semibold text-center my-7">
        {currentUser.username}
      </h1>
      <form onSubmit={handleSubmit} action="" className=" flex flex-col gap-4">
        <input type="file" ref={fileRef} accept="image/*" hidden />
        <img
          className=" rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={currentUser.avatar}
          alt="profile"
          onClick={() => fileRef.current.click()}
        />

        <input
          onChange={handleChange}
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          className=" border p-3 rounded-lg"
        />
        <input
          onChange={handleChange}
          type="text"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className=" border p-3 rounded-lg"
        />
        <input
          onChange={handleChange}
          type="password"
          placeholder="password"
          id="password"
          className=" border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className=" bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading...." : "Update"}
        </button>
      </form>
      <div className=" flex justify-between mt-5">
        <span className=" text-red-700 cursor-pointer" onClick={handDeleteUser}>
          Delete Account
        </span>
        <span className=" text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign out
        </span>
      </div>
      {error && <p className=" text-red-500 mt-5">{error} </p>}
      <p className=" text-green-700 mt-5">
        {updateSuccess ? "User is update succussfully" : ""}
      </p>
    </div>
  );
}
