import { useState } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, LogoLogin, SubmitButton } from "../components";
import baseAPI from "../utils/baseAPI";

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userLogin: "",
    password: "",
  });

  const navigate = useNavigate();

  const demoLogin = async () => {
    try {
      setIsSubmitting(true); // Start submission

      // You can use a predefined "demoUser" object
      const demoUser = {
        userLogin: `${import.meta.env.VITE_DEMO_EMAIL}`,
        password: `${import.meta.env.VITE_DEMO_PASSWORD}`,
      };

      const response = await loginUser(demoUser);
      if (response.success) {
        toast.success(response.message);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 3 seconds
        setIsSubmitting(false); // Enable the button again
        navigate("/dashboard");
      } else {
        toast.error(response.message); // Show error toast with the response message
        await new Promise((resolve) => setTimeout(resolve, 4000)); // Wait for 3 seconds
        setIsSubmitting(false); // Enable the button again
      }
    } catch (error) {
      setIsSubmitting(false); // Enable the button again on error
      console.error("Login Error:", error);
      toast.error(error.response.message);
      await new Promise((resolve) => setTimeout(resolve, 4000)); // Wait for 3 seconds
      setIsSubmitting(false); // Enable the button again
    }
  };

  const loginUser = async (formData) => {
    const response = await baseAPI.post("/users/login", formData);
    return response.data; // Assuming the server sends back user data upon successful registration
  };

  const mutation = useMutation(loginUser);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      formData.userLogin === `${import.meta.env.VITE_DEMO_EMAIL}` &&
      formData.password === `${import.meta.env.VITE_DEMO_PASSWORD}`
    ) {
      await demoLogin();
    } else {
      try {
        setIsSubmitting(true); // Start submission
        const response = await mutation.mutateAsync(formData);
        if (response.success) {
          toast.success(response.message);
          await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 3 seconds
          setIsSubmitting(false); // Enable the button again
          navigate("/dashboard");
        } else {
          toast.error(response.message); // Show error toast with the response message
          await new Promise((resolve) => setTimeout(resolve, 4000)); // Wait for 3 seconds
          setIsSubmitting(false); // Enable the button again
        }
      } catch (error) {
        setIsSubmitting(false); // Enable the button again on error
        console.error("Registration Error:", error);
        toast.error(error.response.message);
        await new Promise((resolve) => setTimeout(resolve, 4000)); // Wait for 3 seconds
        setIsSubmitting(false); // Enable the button again
      }
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
        <LogoLogin />
        <h4>Login</h4>
        <FormRow
          type="text"
          value={formData.userLogin}
          onChange={handleInputChange}
          name="userLogin"
          placeholder="Enter your email or username or phone number"
          labelText="Username"
        />
        <FormRow
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          name="password"
          placeholder="Enter your password"
          labelText="Password"
        />
        <SubmitButton isSubmitting={isSubmitting} formBtn={true} />
        <button
          type="submit"
          className="btn btn-block"
          onClick={demoLogin}
          disabled={isSubmitting}
        >
          Explore The App!
        </button>
        <p>
          Not a member yet?
          <Link to="/register" className="member-btn">
            Register
          </Link>
        </p>
        <p>
          <Link to="/forget-password" className="member-btn smaller-text">
            Forget Password?
          </Link>
        </p>
        <p>
          <Link to="/forget-password" className="member-btn smaller-text">
            Resend Verification Link?
          </Link>
        </p>
      </form>
    </Wrapper>
  );
};

export default Login;
