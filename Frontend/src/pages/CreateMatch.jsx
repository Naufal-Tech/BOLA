import { Button, Form, InputNumber, Select } from "antd";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../assets/css/creatematch.css";

const { Option } = Select;

const CreateMatch = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    data: clubData,
    isLoading: isLoadingClub,
    isError: isErrorClub,
  } = useQuery("clubs", async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/club`);
    return response.data.clubs;
  });

  const createMatch = async (formData) => {
    try {
      // Assuming formData is an object with a "matches" key
      const requestData = { matches: formData.matches };

      console.log("Request data:", requestData); // Log the request data

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/match`,
        requestData
      );

      return response.data;
    } catch (error) {
      console.error("Create-Match Error:", error);
      throw error;
    }
  };

  const mutation = useMutation(createMatch, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          setIsSubmitting(false);
          navigate("/dashboard/create-match");
        }, 3000);
      } else {
        toast.error(data.message);
        setIsSubmitting(false);
      }
    },
    onError: (error) => {
      console.error("Create Match Error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      console.log("Request data:", values); // Log the request data

      mutation.mutate(values);
    } catch (error) {
      console.error("Create-Match Error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  if (isLoadingClub) {
    return <div>Loading clubs...</div>;
  }

  if (isErrorClub || !clubData) {
    toast.error("Failed to fetch club data");
    return <div>Error fetching club data</div>;
  }

  return (
    <div className="faq-card-container">
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          matches: [
            {
              clubHome: clubData[0]._id,
              clubAway: clubData[1]._id,
              score: { homeScore: 0, awayScore: 0 },
            },
          ],
        }}
      >
        <h4 className="form-title">Create Match</h4>

        <Form.List name="matches">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div key={key} className="form-center">
                  <Form.Item
                    {...restField}
                    name={[name, "clubHome"]}
                    fieldKey={[fieldKey, "clubHome"]}
                    label={`Club Home ${fields.length > 1 ? key + 1 : ""}`}
                    rules={[
                      { required: true, message: "Please select a club" },
                    ]}
                  >
                    <Select style={{ width: 200 }}>
                      {clubData.map((club) => (
                        <Option key={club._id} value={club._id}>
                          {club.club_name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "clubAway"]}
                    fieldKey={[fieldKey, "clubAway"]}
                    label={`Club Away ${fields.length > 1 ? key + 1 : ""}`}
                    rules={[
                      { required: true, message: "Please select a club" },
                    ]}
                  >
                    <Select style={{ width: 200 }}>
                      {clubData.map((club) => (
                        <Option key={club._id} value={club._id}>
                          {club.club_name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "score", "homeScore"]}
                    fieldKey={[fieldKey, "score", "homeScore"]}
                    label={`Home Score ${fields.length > 1 ? key + 1 : ""}`}
                  >
                    <InputNumber min={0} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "score", "awayScore"]}
                    fieldKey={[fieldKey, "score", "awayScore"]}
                    label={`Away Score ${fields.length > 1 ? key + 1 : ""}`}
                  >
                    <InputNumber min={0} />
                  </Form.Item>

                  {fields.length > 1 && (
                    <Form.Item className="form-btn">
                      <Button type="default" onClick={() => remove(name)}>
                        Remove
                      </Button>
                    </Form.Item>
                  )}
                </div>
              ))}

              <Form.Item className="form-btn">
                <Button
                  type="default"
                  onClick={() => add()}
                  disabled={fields.length >= clubData.length}
                >
                  Add Match
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item className="form-btn">
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting || mutation.isLoading}
            disabled={mutation.isLoading}
          >
            Create Matches
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateMatch;
