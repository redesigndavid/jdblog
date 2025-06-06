export { Layout };
import "./Layout.css";
import React from "react";
import { API } from "/requester";
import { AiFillGithub, AiFillInstagram, AiFillLinkedin } from "react-icons/ai";
import { FaRegCopyright } from "react-icons/fa";
import { clientOnly } from "vike-react/clientOnly";
import { BsCircleFill } from "react-icons/bs";
import { usePageContext } from "vike-react/usePageContext";
import Link from "@components/Link"

import { navigate, reload } from "vike/client/router";

const ClientLightDarkClientOnly = clientOnly(
  () => import("@components/LightDarkButton"),
);
const LogOutButtonClientOnly = clientOnly(
  () => import("@components/LogOutButton"),
);

function Footer() {
  const pageContext = usePageContext();
  const logOut = pageContext.globalContext.logOut;
  const isLoggedIn = pageContext.globalContext.isLoggedIn;

  return (
    <>
      <div className="flex flex-row w-full rounded-t-xl pt-12 pb-4">
        <div className="flex-auto" />
        <div className="flex flex-col">
          <div className="flex flex-row justify-center items-center gap-2 dark:text-white text-dark pb-8">
            <Link noVisits newTab href="https://github.com/redesigndavid">
              <AiFillGithub size={28} />
            </Link>

            <Link noVisits newTab href="https://linkedin.com/in/redesigndavid">
              <AiFillLinkedin size={28} />
            </Link>

            <Link noVisits newTab href="https://www.instagram.com/redesigndavid">
              <AiFillInstagram size={28} />
            </Link>

            <div className="h-14 border-l-2" />
            <ClientLightDarkClientOnly fallback={<BsCircleFill size={28} />} />

            <LogOutButtonClientOnly isLoggedIn={isLoggedIn} logOut={logOut} />
          </div>
          <div className="flex flex-row justify-center items-center gap-2 dark:text-white text-dark pb-4">
            <FaRegCopyright className="m-auto" />{" "}
            <div className="m-auto align-middle">
              2025 David Marte. All Rights Reserved.
            </div>
          </div>
        </div>
        <div className="flex-auto" />
      </div>
    </>
  );
}

function HeaderLink({ link, name }) {
  const pageContext = usePageContext();

  const currentLink =
    link === "/"
      ? pageContext.urlPathname == "/"
      : pageContext.urlPathname.startsWith(link);

  return (
    <div className="h-12 justify-items-center flex flex-col py-5 cursor-pointer ">
      <div className="flex-auto" />
      <a className={(currentLink && "border-b-4 pb-2") || ""} href={link}>
        {name}
      </a>
      <div className="flex-auto" />
    </div>
  );
}

function Header() {
  return (
    <>
      <div className={"flex flex-row w-full py-3 dark:text-white text-dark "}>
        <div className="flex-auto" />
        <div className="w-full xl:w-7xl pl-4 pr-8 xl:px-0 flex-row flex ">
          <a
            href="/"
            className="pt-1 flex-1 m-auto flex flex-row gap-4 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 justify-items-center">
              <img
                src="/jdmartelogo.svg"
                className="m-auto h-12 w-12 text-white"
              />
            </div>
            <div className="my-auto text-xl font-special hidden md:inline-block">
              redesigndavid.com
            </div>
          </a>

          <div className="flex flex-row gap-8 justify-around">
            <HeaderLink link="/" name="Home" />
            <HeaderLink link="/blog" name="Blog" />
            <div></div>
          </div>
        </div>
        <div className="flex-auto" />
      </div>
    </>
  );
}

const setLoginInfo = (loginfo) => {
  // save to state and localstorage
  localStorage.setItem("loginInfo", JSON.stringify(loginfo));
};

export function track(path, referrer, url) {
  var article_type = null;
  var article_id = null;
  if (path && path.startsWith("/blog/")) {
    article_type = "post";
    article_id = parseInt(path.slice(6));
  }
  const payload = {
    path: path,
    referrer: referrer,
    url: url,
    article_type: article_type,
    article_id: article_id,
  };
  console.log("tracking");
  console.log(payload);

  API.post(`/visit`, payload)
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    })
    .then((res) => console.log("hello"));
}

function Layout({ children }) {
  const pageContext = usePageContext();

  const logOut = () => {
    // clear login info
    pageContext.globalContext.isLoggedIn = false;
    localStorage.removeItem("loginInfo");
    reload();
  };


  if (pageContext.isClientSide) {
    pageContext.globalContext.logOut = logOut;
    pageContext.globalContext.track = track;

    track(window.location.pathname, document.referrer, window.location.href);

    if ("access_token" in pageContext.urlParsed.search) {
      setLoginInfo(pageContext.urlParsed.search);
      pageContext.globalContext.isLoggedIn = true;
      navigate(pageContext.urlPathname, { keepScrollPosition: true }).then(
        () => {
          console.log("Logged in");
        },
      );
    } else if (typeof localStorage.loginInfo !== "undefined") {
      const loginInfo = JSON.parse(localStorage.loginInfo);
      setLoginInfo(loginInfo);
      pageContext.globalContext.isLoggedIn = true;
    }
  }

  return (
    <>
      <Header />
      <div className="w-dvw flex flex-row">
        <div className="flex-auto" />
        <div className="min-h-[calc(50vh)] min-w-7xl">{children}</div>
        <div className="flex-auto" />
      </div>
      <Footer />
    </>
  );
}
