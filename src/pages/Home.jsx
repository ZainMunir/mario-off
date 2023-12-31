import React from "react";
import { AiFillGithub, AiOutlineForm } from "react-icons/ai";
import { MdOutlineAccountCircle } from "react-icons/md";
import { Link, useLoaderData } from "react-router-dom";
import { getCompetition } from "../util-js/competitions-api";
import { BsDice5 } from "react-icons/bs";
import { SiFirebase, SiScrimba, SiTailwindcss, SiVite } from "react-icons/si";
import CompThumbnail from "../components/CompPieces/CompThumbnail";

function Intro({ competition }) {
  return (
    <>
      <h2 className="mb-2 text-2xl">Why this?</h2>
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
        If you would like some more information, that'll be on the rest of this
        page. The code is also public on GitHub{" "}
        <a
          href="https://github.com/ZainMunir/mario-off"
          target="_blank"
          className="inline-block align-middle"
        >
          <AiFillGithub size={20} />
        </a>{" "}
        but viewer discretion is advised.
        <br />
        If you would like an example of a competition, click the thumbnail
        below! Keep in mind that if you're not signed in, user data is
        inaccessible, so names won't show up.
      </p>
      <Link
        to={`/competitions/${competition.id}/`}
        key={competition.id}
        className="mx-auto mt-2 block w-1/3 lg:w-1/2"
      >
        <CompThumbnail
          status={competition.status}
          image={competition.image}
          name={competition.name}
          players={competition.players}
          currentScore={competition.currentScore}
        />
      </Link>
    </>
  );
}

function WebsiteParts() {
  return (
    <>
      <h2 className="mb-2 text-2xl">Parts to the Website</h2>
      <h3 className="text-xl">Making an account</h3>
      <p className="pb-2">
        On the login page, you can choose to login with Google, or signup with
        an email address. Please remember your password if you do the latter,
        but you can reset it in case you forget it. If you choose google, your
        profile will auto-populate with your profile picture from there - that's
        the only information saved. Your username is a random string of
        characeters initially using either method, but you can change it to
        something more readable, along with your picture on the profile page. By
        default, you start with "RwBo" as a friend to test stuff out, but you
        can remove them if you want.
      </p>
      <h3 className="border-t-2 pt-2 text-xl dark:border-gray-700">
        Making friends!
      </h3>
      <p className="pb-2">
        Before you can make a competition, you need to have at least one friend,
        so head over to that page! You can add a friend if you know their
        username. That way you both have access to the competitions you create,
        and no one else (unless you make it public). You can also delete
        friends, but keep in mind that it won't delete any existing competitions
        you may have with them.
      </p>
      <h3 className="border-t-2 pt-2 text-xl dark:border-gray-700">
        Creating your first competition
      </h3>
      <p>
        When you create a competition, you need to at the very least choose a
        name for it and who it's against. You can change the name later, but not
        your opponent. You can also add a picture and see how everything looks
        on the thumbnail. As soon as you create the competition, your friend can
        also access it and you both can add and edit parts, such as rules,
        rounds and subrounds. Score is calculated automatically based on the
        rounds, and once a competition is marked complete, your score against
        that friend will update too! Rounds only count towards the score if
        they're checked.
      </p>
    </>
  );
}

function Issues() {
  return (
    <>
      <h2 className="mb-2 text-2xl">Issues</h2>
      <p>
        I ran into bugs and quirks constantly while making this website, and
        while I tried to get rid of as many as I could, I'm sure I missed some.
        If you see something funky, please let me know by creating an issue{" "}
        <a
          href="https://github.com/ZainMunir/mario-off/issues"
          target="_blank"
          className="inline-block align-middle"
        >
          <AiOutlineForm size={20} />
        </a>{" "}
        on GitHub with some details. I'll do my best fix them.
      </p>
    </>
  );
}

function Suggestions() {
  return (
    <>
      <h2 className="mb-2 text-2xl">Suggestions</h2>
      <p>
        This website was made with my very one-track mind for the most part. If
        you have ideas on improvements, or things that would be nice to add, let
        me know on GitHub{" "}
        <a
          href="https://github.com/ZainMunir/mario-off/issues"
          target="_blank"
          className="inline-block align-middle"
        >
          <AiOutlineForm size={20} />
        </a>
        . I'll try to learn enough to add them if I have the time (and only if
        they're not ridiculous).
      </p>
    </>
  );
}

function DelAccount() {
  return (
    <>
      <h2 className="mb-2 text-2xl">Delete Your Account</h2>
      <p>
        You can delete your account at any time on the profile page. Doing so
        means you will no longer have access to any competitions you're a part
        of, and your username may be freed up in the future for someone else to
        use. Your profile picture will also be cleared. Don't click it if you
        want to keep your account, because undoing it is a pain for me and I
        probably won't put in the effort.
      </p>
    </>
  );
}

function HowStuffWorks() {
  return (
    <>
      <h2 className="mb-2 text-2xl">How stuff works</h2>
      <h3 className="text-xl">React</h3>
      <p className="pb-2">
        This is my first proper foray (after this{" "}
        <a
          href="https://zainmunir.github.io/tenzies-extracredit/"
          target="_blank"
          className="inline-block align-middle"
        >
          <BsDice5 size={15} />
        </a>
        ) into making something with React, so if it's a bit rough around the
        edges, I have an excuse :D <br />I used vite{" "}
        <a
          href="https://vitejs.dev/"
          target="_blank"
          className="inline-block align-middle "
        >
          <SiVite size={20} />
        </a>{" "}
        to put stuff together, tailwind{" "}
        <a
          href="https://tailwindcss.com/"
          target="_blank"
          className="inline-block align-middle "
        >
          <SiTailwindcss size={20} />
        </a>{" "}
        to style everything poorly and a lot of questionable Javascript to make
        this beaut. Then I just hosted it using firebase (originally I used
        GitHub pages, but the google login links looked suspicious). <br />I
        learnt the fundamentals from free react courses on scrimba{" "}
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
      <h3 className="border-t-2 pt-2 text-xl dark:border-gray-700">
        Firebase{" "}
        <a
          href="https://firebase.google.com/"
          target="_blank"
          className="inline-block align-middle"
        >
          <SiFirebase size={20} />
        </a>
      </h3>
      <p>
        I'm using Firebase's firestore database to store all the competitions
        and the minimal amount of user information needed to make it all work. I
        have not paid for this, so there is a high likelyhood that everything
        will break for the day if more than 10 people use it in a day because
        we've hit the 50k read limit. Sorry? <br />
        I've tried to make the database rules as robust as possible but there
        are limitations with the free tier so there is probably opportunity for
        abuse. To that end, the only things stored in the database are the
        competitions, your username you've set for this website specifically,
        profile picture and friends list. Don't put any sensitive data anywhere
        please - I can't save you if you do. <br />
        Authentication is done using the tools in firebase too, meaning they're
        not stored directly in the database so email addresses are inaccesible.
        Passwords are obviously not saved, so don't ask me if you forget yours.
      </p>
    </>
  );
}

export function loader() {
  return getCompetition("G1h8eToxiquDJIx7lbHL");
}

export default function Home() {
  const competition = useLoaderData();

  return (
    <div className="mx-auto flex flex-grow flex-col p-2 text-justify text-lg">
      <h1 className="mb-2 text-center text-4xl font-bold">
        Welcome to the Mario-off Competitions Website!
      </h1>
      <div className="flex w-full flex-grow flex-col items-center 2xl:flex-row">
        <div className="flex h-full flex-grow flex-col lg:w-full lg:flex-row">
          <div className="h-full border-b-4 py-5 dark:border-gray-700 lg:w-1/2 lg:border-r-2 lg:px-5 2xl:border-b-0 2xl:border-r-2">
            <Intro competition={competition} />
          </div>
          <div className="h-full border-b-4 py-5 dark:border-gray-700 lg:w-1/2 lg:px-5  2xl:border-b-0 2xl:border-r-2 ">
            <WebsiteParts />
          </div>
        </div>
        <div className="flex h-full flex-grow flex-col lg:w-full lg:flex-row">
          <div className="h-full border-b-4 py-5 dark:border-gray-700 lg:w-1/2 lg:border-b-0 lg:border-r-2 lg:px-5 2xl:border-r-2 ">
            <HowStuffWorks />
          </div>
          <div className="h-full lg:w-1/2 lg:px-5">
            <div className="border-b-2 py-5 pb-2 dark:border-gray-700">
              <Issues />
            </div>
            <div className="border-b-2 pb-2 pt-2 dark:border-gray-700">
              <Suggestions />
            </div>
            <div className="pt-2">
              <DelAccount />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
