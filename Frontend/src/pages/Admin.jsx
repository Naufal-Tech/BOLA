import { Button, message, Modal, Table } from "antd";
import axios from "axios";
import { useState } from "react";
import { BsFillFileEarmarkCheckFill } from "react-icons/bs";
import { FaCalendarCheck, FaSuitcaseRolling } from "react-icons/fa";
import { GiConversation } from "react-icons/gi";
import { GrPersonalComputer } from "react-icons/gr";
import { ImCross } from "react-icons/im";
import { MdPending } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { redirect, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/StatsContainer";
import { StatItem } from "../components";

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/users/app-stats`
    );
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return redirect("/dashboard");
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserList = () => {
  return useQuery("userList", async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/users/app-stats`
    );
    return response.data;
  });
};

const Admin = () => {
  const {
    users,
    userList,
    jobs,
    Pending,
    Interview,
    Declined,
    technical,
    Accepted,
  } = useLoaderData();

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const queryClient = useQueryClient();
  const userListQuery = useUserList(); // Use the custom hook

  // Define a mutation using react-query's useMutation
  const deleteUserMutation = useMutation(async (userId) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/users/delete`, {
      data: { user_id: userId },
    });
  });

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteUserMutation.mutateAsync(selectedUserId); // Trigger the mutation
      message.success("User deleted successfully");
      setLoading(false);
      setIsModalVisible(false);
      queryClient.invalidateQueries("userList");
    } catch (error) {
      message.error("Error deleting user");
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Is Verified",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (isVerified) => (isVerified ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            danger
            loading={loading}
            onClick={() => {
              setSelectedUserId(record.user_id);
              setIsModalVisible(true);
            }}
          >
            Delete
          </Button>
          <Modal
            title="Confirm Delete"
            visible={isModalVisible}
            onOk={handleDelete}
            onCancel={() => setIsModalVisible(false)}
          >
            <p>Are you sure you want to delete this user?</p>
          </Modal>
        </>
      ),
    },
  ];

  return (
    <>
      <Wrapper>
        <StatItem
          title="Total Users"
          count={users}
          color="#e9b949"
          bcg="#fcefc7"
          icon={<FaSuitcaseRolling />}
        />
        <StatItem
          title="Total Jobs"
          count={jobs}
          color="#647acb"
          bcg="#e0e8f9"
          icon={<FaCalendarCheck />}
        />
        <StatItem
          title="Total Pending Jobs"
          count={Pending}
          color="#f59e0b"
          bcg="#fef3c7"
          icon={<MdPending />}
        />
        <StatItem
          title="Total Interview Jobs"
          count={Interview}
          color="#ff00f7"
          bcg="#f2ff00"
          icon={<GiConversation />}
        />
        <StatItem
          title="Total Technical Jobs"
          count={technical}
          color="#08b1ff"
          bcg="#08b1ff"
          icon={<GrPersonalComputer />}
        />
        <StatItem
          title="Total Decline Jobs"
          count={Declined}
          color="#d66a6a"
          bcg="#ffeeee"
          icon={<ImCross />}
        />
        <StatItem
          title="Total Accepted Jobs"
          count={Accepted}
          color="#57ff19"
          bcg="#687878"
          icon={<BsFillFileEarmarkCheckFill />}
        />
      </Wrapper>

      <div className="table-container">
        <h2 className="table-title">User List</h2>
        <Table
          dataSource={userList ? userListQuery.data?.userList : userList}
          columns={columns}
          rowKey="user_id"
        />
      </div>
    </>
  );
};

export default Admin;
