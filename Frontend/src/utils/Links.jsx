import { FcStatistics } from "react-icons/fc";
import { GiSoccerBall } from "react-icons/gi";
import { ImProfile } from "react-icons/im";
import { RiAdminFill } from "react-icons/ri";

const Links = [
  {
    id: 1,
    text: "Create Match",
    path: "create-match",
    icon: <GiSoccerBall />,
  },
  { id: 2, text: "Standings", path: "standings", icon: <FcStatistics /> },
  { id: 3, text: "Profile", path: "profile", icon: <ImProfile /> },
  { id: 4, text: "Admin", path: "admin", icon: <RiAdminFill /> },
];

export default Links;
