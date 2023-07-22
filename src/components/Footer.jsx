import React from "react";
import { AiFillGithub, AiOutlineForm } from "react-icons/ai";

export default function Footer() {
  return (
    <footer className="min-h-min w-screen flex items-center justify-center mt-auto bg-gray-200 ">
      <div className="h-6 w-80 flex justify-end items-center">
        <p className="ml-2 mr-auto text-xs">Mario-off</p>
        <a
          href="https://github.com/ZainMunir/mario-off/issues"
          target="_blank"
          className="mr-2"
        >
          <AiOutlineForm size={20} />
        </a>
        <a
          href="https://github.com/ZainMunir/mario-off"
          target="_blank"
          className="mr-2"
        >
          <AiFillGithub size={20} />
        </a>
      </div>
    </footer>
  );
}
