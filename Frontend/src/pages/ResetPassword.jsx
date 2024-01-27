import { useState } from "react";
import { useMutation } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo, SubmitButton } from "../components";
import baseAPI from "../utils/baseAPI";

const ResetPassword = () => {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    token: token,
  });

  const navigate = useNavigate();

  const resetPasswordMutation = useMutation(async (formData) => {
    const response = await baseAPI.post("/users/reset-password", formData);
    return response.data;
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { newPassword, confirmPassword } = formData;
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    console.log("🚀 formData:", formData);
    setIsSubmitting(true); // Start submission

    try {
      await resetPasswordMutation.mutateAsync(formData);

      toast.success("Password has been successfully reset");
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsSubmitting(false); // Enable the button again
      navigate("/login"); // Redirect to login page
    } catch (error) {
      setIsSubmitting(false); // Enable the button again on error
      console.error("Reset Password Error:", error);
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
        <h4>Reset Password</h4>
        <FormRow
          type="password"
          value={formData.newPassword}
          onChange={handleInputChange}
          name="newPassword"
          placeholder="Enter your new password"
          labelText="New Password"
        />
        <FormRow
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          name="confirmPassword"
          placeholder="Please confirm your new password"
          labelText="Confirm Password"
        />
        <SubmitButton
          isSubmitting={isSubmitting}
          formBtn={true}
          buttonText="Reset Password"
        />
      </form>
    </Wrapper>
  );
};

export default ResetPassword;
