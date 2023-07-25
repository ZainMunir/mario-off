import React from "react";
import { AiFillGithub, AiOutlineForm } from "react-icons/ai";

export default function Footer() {
  return (
    <footer className="mt-auto flex h-6 w-screen items-center justify-center bg-gray-200 dark:bg-gray-600 dark:text-white">
      <div className="max-w-screen flex h-6 w-full items-center justify-end">
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
