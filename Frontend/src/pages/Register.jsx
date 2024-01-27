import { useState } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo } from "../components";
import baseAPI from "../utils/baseAPI";

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateUsername = (username) => {
    return username.length >= 3;
  };

  const validateFirstname = (firstName) => {
    return firstName.length >= 3;
  };

  const validateLastname = (lastName) => {
    return lastName.length >= 3;
  };

  const registerUser = async (formData) => {
    const response = await baseAPI.post("/users/register", formData);
    return response.data;
  };

  const mutation = useMutation(registerUser);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!validateUsername(formData.username)) {
      toast.error("Username must be at least 3 characters long");
      return;
    }

    if (!validateFirstname(formData.firstName)) {
      toast.error("Firstname must be at least 3 characters long");
      return;
    }

    if (!validateLastname(formData.lastName)) {
      toast.error("Lastname must be at least 3 characters long");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await mutation.mutateAsync(formData);
      if (response.success) {
        toast.success(response.message);
        await new Promise((resolve) => setTimeout(resolve, 500));
        navigate("/login");
      } else {
        toast.error(response.message);
        await new Promise((resolve) => setTimeout(resolve, 4000));
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.response.message);
      await new Promise((resolve) => setTimeout(resolve, 4000));
    } finally {
      setIsSubmitting(false);
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
        <h4>Register</h4>
        <FormRow
          type="text"
          name="username"
          value={formData.username}
          labelText="Username"
          onChange={handleInputChange}
          placeholder="Enter your username"
          required
        />
        <FormRow
          type="text"
          name="firstName"
          labelText="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="Enter your first name"
          required
        />
        <FormRow
          type="text"
          name="lastName"
          labelText="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Enter your last name"
          required
        />
        <FormRow
          type="email"
          labelText="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
        />
        <FormRow
          type="password"
          name="password"
          labelText="Password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          required
        />
        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <p>
          Already a member?{" "}
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;
