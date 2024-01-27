import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { FormRow } from "../components";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  // eslint-disable-next-line no-unused-vars
  const { username, fullName, email, phoneNumber, employeeId } = user;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username,
    fullName,
    email,
    currentPassword: "",
    newPassword: "",
    employeeId,
    phoneNumber,
  });

  // Validation
  const validateFileSize = (file) => {
    const maxFileSize = 5 * 1024 * 1024; // 5 MB in bytes
    return file.size <= maxFileSize;
  };

  const validateUsername = (username) => {
    return username.length >= 3 && username.length <= 20;
  };

  const validatefullName = (fullName) => {
    return fullName.length >= 3 && fullName.length <= 20;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const validatenewPassword = (newPassword) => {
    return newPassword.length >= 6;
  };

  const validatecurrentPassword = (currentPassword) => {
    return currentPassword.length >= 6;
  };

  const editProfile = async (formData) => {
    const formDataToSend = new FormData();

    formDataToSend.append("username", formData.username);
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);

    // Append img_profile file to FormData object if selected
    if (formData.img_profile) {
      formDataToSend.append("img_profile", formData.img_profile);
    }

    // Append currentPassword if provided and not empty
    if (
      formData.currentPassword &&
      validatecurrentPassword(formData.currentPassword)
    ) {
      formDataToSend.append("currentPassword", formData.currentPassword);
    }

    // Append newPassword if provided and not empty
    if (formData.newPassword && validatenewPassword(formData.newPassword)) {
      formDataToSend.append("newPassword", formData.newPassword);
    }

    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/users/update`,
      formDataToSend
    );

    return response.data;
  };

  const mutation = useMutation(editProfile);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedFile = event.target.img_profile.files[0];

    // If no values are provided in the form, replace with the existing user values
    const updatedFormData = {
      username: formData.username || username,
      fullName: formData.fullName || fullName,
      email: formData.email || email,
      img_profile: selectedFile || null,
    };

    if (updatedFormData.img_profile) {
      if (!validateFileSize(updatedFormData.img_profile)) {
        toast.error("File size must be less than 5 MB");
        return;
      }
    }

    if (!validateUsername(updatedFormData.username)) {
      toast.error("Username must be at least 3-20 characters long");
      return;
    }

    if (!validatefullName(updatedFormData.fullName)) {
      toast.error("Full name must be at least 3-20 characters long");
      return;
    }

    if (!validateEmail(updatedFormData.email)) {
      toast.error("Please input a valid email address");
      return;
    }

    if (
      formData.currentPassword &&
      validatecurrentPassword(formData.currentPassword)
    ) {
      updatedFormData.currentPassword = formData.currentPassword;
    } else {
      delete updatedFormData.currentPassword;
    }

    if (formData.newPassword && validatenewPassword(formData.newPassword)) {
      updatedFormData.newPassword = formData.newPassword;
    } else {
      delete updatedFormData.newPassword;
    }

    try {
      setIsSubmitting(true);

      const response = await mutation.mutateAsync(updatedFormData);
      if (response.success) {
        toast.success(response.message);
        await new Promise((resolve) => setTimeout(resolve, 500));
        navigate("/dashboard/profile");
      } else {
        toast.error(response.message);
        await new Promise((resolve) => setTimeout(resolve, 4000));
      }
    } catch (error) {
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
      <form
        className="form"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <h4 className="form-title">Update Profile</h4>
        <div className="form-center">
          <div className="form-row">
            <label htmlFor="img_profile" className="form-label">
              Select an Image File
            </label>
            <input
              type="file"
              id="img_profile"
              name="img_profile"
              className="form-input"
              accept="image/*"
            />
          </div>
          <FormRow
            type="text"
            name="username"
            value={formData.username}
            labelText="Username"
            onChange={handleInputChange}
            placeholder="Enter Username"
            required
          />
          <FormRow
            type="text"
            name="fullName"
            value={formData.fullName}
            labelText="Full Name"
            onChange={handleInputChange}
            placeholder="Enter Full Name"
            required
          />
          <FormRow
            type="text"
            name="email"
            value={formData.email}
            labelText="Email Address"
            onChange={handleInputChange}
            placeholder="Enter Email Address"
            required
          />
          <FormRow
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            labelText="Current Password"
            onChange={handleInputChange}
            placeholder="Enter Current Password to Change Your Password"
          />
          <FormRow
            type="password"
            name="newPassword"
            value={formData.newPassword}
            labelText="New Password"
            onChange={handleInputChange}
            placeholder="Enter New Password to Change Your Password"
          />
          <FormRow
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            labelText="Phone Number"
            onChange={handleInputChange}
            placeholder="Enter Phone Number"
            // Add validation based on your requirements
            // Example: minLength, maxLength, pattern, etc.
            required
          />
          {user.role === "Admin" && (
            <FormRow
              type="text"
              name="employeeId"
              value={formData.employeeId}
              labelText="Employee ID"
              onChange={handleInputChange}
              placeholder="Enter Employee ID"
              // Add validation based on your requirements
              required
            />
          )}
          <button
            type="submit"
            className="btn btn-block form-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Profile;
