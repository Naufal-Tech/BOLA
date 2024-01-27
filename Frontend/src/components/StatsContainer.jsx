/* eslint-disable react/prop-types */
import { GiConversation } from "react-icons/gi";
import { GrPersonalComputer } from "react-icons/gr";
import { ImCross } from "react-icons/im";
import { MdPending } from "react-icons/md";
import Wrapper from "../assets/wrappers/StatsContainer";
import StatItem from "./StatItem";

const StatsContainer = ({ defaultStats }) => {
  const stats = [
    {
      title: "Project Website",
      count: defaultStats?.website || 0,
      icon: <MdPending />,
      color: "#f59e0b",
      bcg: "#fef3c7",
    },
    {
      title: "Referensi",
      count: defaultStats?.referensi || 0,
      icon: <GiConversation />,
      color: "#ff00f7",
      bcg: "#f2ff00",
    },
    {
      title: "Project Design",
      count: defaultStats?.design || 0,
      icon: <GrPersonalComputer />,
      color: "#08b1ff",
      bcg: "#08b1ff",
    },
    {
      title: "Client",
      count: defaultStats?.totalClients || 0,
      icon: <ImCross />,
      color: "#d66a6a",
      bcg: "#ffeeee",
    },
    // {
    //   title: "Accepted",
    //   count: defaultStats?.accepted || 0,
    //   icon: <BsFillFileEarmarkCheckFill />,
    //   color: "#57ff19",
    //   bcg: "#687878",
    // },
  ];

  return (
    <Wrapper>
      {stats.map((item) => {
        return <StatItem key={item.title} {...item} />;
      })}
    </Wrapper>
  );
};

export default StatsContainer;
