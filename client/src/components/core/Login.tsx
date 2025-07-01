"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoEyeOff, IoEye } from "react-icons/io5";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Aboreto } from "next/font/google";
const aboreto = Aboreto({
  subsets: ["latin"],
  weight: "400",
});
import { Rajdhani } from "next/font/google";
const r = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-white bg-black">
      {/* Left Side */}
      <div className="md:w-1/2 flex flex-col justify-center items-center text-center px-6 py-12 relative overflow-hidden">
        <div className="z-10 ml-100">
          <h1
            className={`text-2xl md:text-4xl font-semibold ${aboreto.className}`}
          >
            LET'S GET YOU BACK <p>ON-CHAIN</p>
          </h1>

          <div className="relative w-100 h-[2px] bg-white/50 rounded-full overflow-visible my-6 mx-auto">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                w-[60%] h-[8px] bg-gradient-to-r from-[#3599B2]/90 to-[#406EBC]/90 
               blur-sm rounded-full"
            />
          </div>

          <p
            className={`text-gray-400 mt-2 md:text-2xl max-w-sm mx-auto ${r.className}`}
          >
            Secure access to your AI agent and DAO activity
          </p>
        </div>

        {/* Logo */}
        <div className="absolute bottom-20 -left-16 z-0">
          <Image
            src="/halflogo.svg"
            alt="Logo"
            width={350}
            height={300}
            priority
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="md:w-1/2 flex justify-center items-center bg-black p-6">
        <div className="bg-gradient-to-r from-[#3599B2] to-[#406EBC] rounded-3xl p-0.5 max-w-md w-full">
          <div className="bg-[#1c1c1e] p-8 rounded-3xl shadow-xl ">
            <h2 className="text-3xl font-bold text-center mb-2">
              Welcome Back !
            </h2>
            <p className="text-center text-white mb-6">Sign in to continue</p>

            <form className="space-y-4">
              {/* Email */}
              <div>
                <label className="font-semibold text-sm " htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="eg. janedoe@gmail.com"
                  className="w-full px-4 py-2 rounded-md bg-netural-gray-100 text-white focus:outline-none focus:ring-2 focus:ring-white mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-semibold text-sm " htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="abcd123"
                    className="w-full px-4 py-2 rounded-md bg-netural-gray-100 text-white pr-10 focus:outline-none focus:ring-2 focus:ring-white mt-1"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-2.5 text-xl text-gray-400"
                  >
                    {showPassword ? <IoEye /> : <IoEyeOff />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Sign In */}
              <Button
                type="submit"
                className="w-full py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition cursor-pointer"
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6 gap-2">
              <Separator className="flex-grow h-px bg-gray-100 rounded-full" />
              <span className="text-gray-500">Or</span>
              <Separator className="flex-grow h-px bg-gray-100 rounded-full" />
            </div>

            {/* Google Sign-in */}
            <Button
              type="button"
              className="flex items-center justify-center gap-2 w-50 py-3 ml-25 border border-gray-600 rounded-md hover:bg-gray-700 transition bg-black cursor-pointer"
            >
              <FcGoogle className="text-lg" />
              Google
            </Button>

          
            <p className="mt-6 text-sm text-center text-gray-400">
              Don&apos;t have an account?{" "}
              <a href="#" className="text-white underline hover:text-gray-300">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
