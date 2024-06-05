"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const [useremail, setuseremail] = useState("");
  const [userin, setUserIn] = useState(false);
  const [updatePass, setUpdatePass] = useState(false);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout Successfully");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log("Data", res.data);
    setData(res.data.data._id);
    setuseremail(res.data.data.email);
    setUserIn(true)
    console.log(res.data.email);
  };

  const onForgotPassword = async () => {
    try {
      const response = await axios.post("/api/users/reset", {
        email: useremail,
        emailType: "RESET",
      });
      console.log("Forgot Password Success", response.data);
      toast.success("Password reset email sent!");
      setUpdatePass(true);
    } catch (error: any) {
      console.log("Forgot Password failed", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p>Profile page</p>
      <h2 className="p-1 rounded bg-green-500">
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <h2>{useremail}</h2>
      <hr />
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>

      {userin ? <button
        onClick={onForgotPassword}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 mt-3"
      >
        Forgot Password
      </button> : null}

      {updatePass ? (
        <Link href="/updatepassword">
          <button className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go to Pass Update
          </button>
        </Link>
      ) : null}

      <button
        onClick={getUserDetails}
        className="bg-green-800 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        GetUser Details
      </button>
    </div>
  );
}
