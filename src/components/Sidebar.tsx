import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HiOutlineHashtag,
  HiOutlineHome,
  HiOutlineMenu,
  HiOutlineUserGroup,
  HiOutlineHeart 
} from "react-icons/hi";
import { RiCloseLine, RiIndentIncrease } from "react-icons/ri";

// Define the type for the link items
interface LinkItem {
  name: string;
  to: string;
  icon: React.ElementType; // React component type for icons
}

// Define the links with type annotation
const links: LinkItem[] = [
  { name: "Discover", to: "/", icon: HiOutlineHome },
  { name: "Top Charts", to: "/top-charts", icon: HiOutlineHashtag },
  { name: "Favorites", to: "/favorite", icon:  HiOutlineHeart  },
  { name: "Playback Queue", to: "/queue", icon: RiIndentIncrease },
  { name: "Listening Room", to: "/listening", icon: HiOutlineUserGroup },
];

// Define the type for NavLinks props
interface NavLinksProps {
  handleClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ handleClick }) => (
  <div className="mt-10">
    {links.map((item) => (
      <NavLink
        key={item.name}
        to={item.to}
        className="flex flex-row justify-start items-center my-8 text-sm font-medium text-gray-400 hover:text-cyan-400"
        onClick={() => handleClick && handleClick()}
      >
        <item.icon className="w-6 h-6 mr-2" />
        {item.name}
      </NavLink>
    ))}
  </div>
);

const Sidebar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <>
      <div className="md:flex hidden flex-col w-[240px] py-10 px-4 bg-[#191624]">
        {/* <h3 className=" font-bold text-3xl text-white text-left">
          {user && <p>Welcome, {user.username}!</p>}
        </h3> */}
        <NavLinks />
      </div>

      {/* Mobile sidebar */}
      <div className="absolute md:hidden block top-6 right-3">
        {!mobileMenuOpen ? (
          <HiOutlineMenu
            className="w-6 h-6 mr-2 text-white"
            onClick={() => setMobileMenuOpen(true)}
          />
        ) : (
          <RiCloseLine
            className="w-6 h-6 mr-2 text-white"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>

      <div
        className={`absolute top-0 h-screen w-2/3 bg-gradient-to-tl from-white/10 to-[#483D8B] backdrop-blur-lg z-10 p-6 md:hidden smooth-transition ${
          mobileMenuOpen ? "left-0" : "-left-full"
        }`}
      >
        <NavLinks handleClick={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;
