"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setloading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const updatePassword = async () => {
    try {
      setloading(true);
     const response = await axios.post("/api/users/resetSucces", { token, newPassword });
      console.log("Password Updated", response.data);
      toast.success(response.data.message); 
      router.push("/profile");
    } catch (error: any) {
        console.log(error.response.data); 
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (newPassword.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [newPassword]);

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");

    // const {query} = router
    // const urltokenTwo = query.token
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing" : "Signup"}</h1>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="password"
        type="text"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="update password"
      />
      <button
        onClick={updatePassword}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      >
        {buttonDisabled ? "No signup" : "Update Password"}
      </button>
    </div>
  );
};

export default Page;
