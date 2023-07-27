import React from "react";
import { AiFillGithub, AiOutlineForm } from "react-icons/ai";
import { MdOutlineAccountCircle } from "react-icons/md";
import { Link } from "react-router-dom";
import { BsDice5 } from "react-icons/bs";
import { SiScrimba } from "react-icons/si";

export default function Home() {
  return (
    <div className="mx-auto flex h-full max-w-xl flex-grow flex-col border-x-2 p-2 text-justify dark:border-gray-700">
      <div className="border-b-4 pb-4 dark:border-gray-700">
        <h1 className="mb-2 text-center text-4xl font-bold">
          Welcome to the Mario-off Competitions Website!
        </h1>
        <p>
          This website was made for (and somewhat designed around) competitions
          between a friend and I while we play various Super Mario games, but
          should work for any sort of round based competition. If you haven't
          already, please head to the account page{" "}
          <Link to="/login" className="inline-block align-middle">
            <MdOutlineAccountCircle size={20} />
          </Link>{" "}
          and signup/login!
          <br />
          If you would like some more information, that'll be below this. The
          code is also public on GitHub{" "}
          <a
            href="https://github.com/ZainMunir/mario-off"
            target="_blank"
            className="inline-block align-middle"
          >
            <AiFillGithub size={20} />
          </a>{" "}
          but viewer discretion is advised.
        </p>
      </div>
      <div className="border-b-4 py-4 dark:border-gray-700 ">
        <h2 className="mb-2 text-2xl">Parts to the Website</h2>
        <h3 className="text-lg">Making an account</h3>
        <p className="pb-2">
          On the login page, you can choose to login with Google, or signup with
          an email address. Please remember your password if you do the latter
          because I haven't implemented password resetting yet! If you choose
          google, you're profile will auto populate with your profile picture
          from there - that's the only information saved. Your username is
          automatically generated using either method, but you can change it to
          something more readable, along with your picture on the profile page.
        </p>
        <h3 className="border-t-2 pt-2 text-lg dark:border-gray-700">
          Making friends!
        </h3>
        <p className="pb-2">
          Before you can make a competition, you need to have at least one
          friend, so head over to that page! You can add a friend if you know
          their username. That way you both have access to the competitions you
          create, and no one else. You can also delete friends, but keep in mind
          that it won't delete any existing competitions you may have with them.
        </p>
        <h3 className="border-t-2 pt-2 text-lg dark:border-gray-700">
          Creating your first competition
        </h3>
        <p>
          When you create a competition, you need to at the very least choose a
          name for it and who it's against. You can change the name later, but
          not your opponent. You can also add a picture and see how everything
          looks on the thumbnail. As soon as you create the competition, your
          friend can also access it and you both can add and edit parts, such as
          rules, rounds and subrounds. Score is calculated automatically based
          on the rounds, and once a competition is marked complete, your score
          against that friend will update too! Rounds only count towards the
          score if they're checked.
        </p>
      </div>
      <div className="border-b-4 py-4 dark:border-gray-700 ">
        <h2 className="mb-2 text-2xl">Issues</h2>
        <p>
          I ran into bugs and quirks constantly while making this website, and
          while I tried to get rid of as many as I could, I'm sure I missed
          some. If you see something funky, please let me know by creating an
          issue{" "}
          <a
            href="https://github.com/ZainMunir/mario-off/issues"
            target="_blank"
            className="inline-block align-middle"
          >
            <AiOutlineForm size={20} />
          </a>{" "}
          on GitHub with some details. I'll do my best fix them.
        </p>
      </div>
      <div className="border-b-4 py-4 dark:border-gray-700 ">
        <h2 className="mb-2 text-2xl">Suggestions</h2>
        <p>
          This website was made with my very one-track mind for the most part.
          If you have ideas on improvements, or things that would be nice to
          add, let me know on GitHub{" "}
          <a
            href="https://github.com/ZainMunir/mario-off/issues"
            target="_blank"
            className="inline-block align-middle"
          >
            <AiOutlineForm size={20} />
          </a>
          . I'll try to learn how to add them if I have the time (only if
          they're not ridiculous).
        </p>
      </div>
      <div className=" py-4">
        <h2 className="mb-2 text-2xl">How stuff works</h2>
        <h3 className="text-lg">React</h3>
        <p className="pb-2">
          This is my first proper foray (after this{" "}
          <a
            href="https://github.com/ZainMunir/mario-off"
            target="_blank"
            className="inline-block align-middle"
          >
            <BsDice5 size={15} />
          </a>
          ) into making something with React, so if it's a bit rough around the
          edges, I have an excuse :D <br />I used vite to put stuff together,
          tailwind to style everything poorly and a lot of questionable
          Javascript to make this beaut. Then I just hosted it using GitHub
          pages. <br />I learnt the fundamentals from free react courses on
          scrimba{" "}
          <a
            href="https://scrimba.com/"
            target="_blank"
            className="inline-block align-middle "
          >
            <SiScrimba size={20} />
          </a>{" "}
          and then an absolutely metric ton of googling, and reading
          documentation, and then some more googling.
        </p>
        <h3 className="border-t-2 pt-2 text-lg dark:border-gray-700">
          Firebase
        </h3>
        <p>
          I'm using Firebase's firestore database to store all the competitions
          and the minimal amount of user information needed to make it all work.
          I have not paid for this, so there is a high likelyhood that
          everything will break for the day if more than 10 people use it in a
          day because we've hit the 50k read limit. Sorry? <br />
          I've tried to make the database rules as robust as possible but there
          are limitations with the free tier so there is probably opportunity
          for abuse. To that end, the only things stored in the database are the
          competitions, your username for this website specifically, profile
          picture and friends list. Don't put any sensitive data anywhere please
          - I can't save you if you do. <br />
          Authentication is done using the tools in firebase too, meaning
          they're not stored directly in the database so email addresses are
          inaccesible. Passwords are obviously not saved, so don't ask me if you
          forget yours.
        </p>
      </div>
    </div>
  );
}
