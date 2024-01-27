import { Table } from "antd";
import axios from "axios";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import "../assets/css/standings.css";

// eslint-disable-next-line react-refresh/only-export-components
export const standingsData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/standings`
    );
    return response.data;
  } catch (error) {
    console.error("Standings Error:", error);
    throw error;
  }
};

const Standings = () => {
  const { data, isLoading, isError } = useQuery("standings", standingsData);

  const columns = [
    {
      title: "No",
      render: (text, record, index) => index + 1,
      align: "center",
    },
    {
      title: "Club Name",
      dataIndex: "club_name",
      key: "club_name",
      align: "center",
    },
    {
      title: "Total Matches",
      dataIndex: "total_matches",
      key: "total_matches",
      align: "center",
    },
    {
      title: "Wins",
      dataIndex: "wins",
      key: "wins",
      align: "center",
    },
    {
      title: "Draws",
      dataIndex: "draws",
      key: "draws",
      align: "center",
    },
    {
      title: "Loses",
      dataIndex: "loses",
      key: "loses",
      align: "center",
    },
    {
      title: "Total Goals",
      dataIndex: "total_goals",
      key: "total_goals",
      align: "center",
    },
    {
      title: "Goals Against",
      dataIndex: "goals_against",
      key: "goals_against",
      align: "center",
    },
    {
      title: "Goal Difference",
      dataIndex: "goal_difference",
      key: "goal_difference",
      align: "center",
    },
    {
      title: "Total Points",
      dataIndex: "total_points",
      key: "total_points",
      align: "center",
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    toast.error("Failed to fetch standings data");
    return null;
  }

  return (
    <Table
      columns={columns}
      dataSource={data?.data}
      loading={isLoading}
      rowKey={(record) => record.club_name}
    />
  );
};

export default Standings;
