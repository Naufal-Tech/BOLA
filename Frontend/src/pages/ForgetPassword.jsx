import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo, SubmitButton } from "../components";
import baseAPI from "../utils/baseAPI";

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const navigate = useNavigate();

  const forgotPasswordMutation = useMutation(async (formData) => {
    const response = await baseAPI.post("/users/forgot-password", formData);
    return response.data;
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      await forgotPasswordMutation.mutateAsync(formData);

      toast.success("Password reset link sent to your email");
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsSubmitting(false);
      navigate("/login");
    } catch (error) {
      setIsSubmitting(false);
      console.error("Forgot Password Error:", error);
      toast.error(error.response.data.message);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <Logo />
        <h4>Forgot Password</h4>
        <FormRow
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          name="email"
          placeholder="Enter your email"
          labelText="Email"
          required
        />
        <SubmitButton
          isSubmitting={isSubmitting}
          formBtn={true}
          buttonText="Send Reset Link"
        />
      </form>
    </Wrapper>
  );
};

export default ForgotPassword;
