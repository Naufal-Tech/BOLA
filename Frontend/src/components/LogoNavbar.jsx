import logo from "../assets/images/logo.svg";

const Logo = () => {
  return (
    <div className="logo-container">
      <img
        src={logo}
        alt="job-logo"
        className="logo"
        style={{ width: "200px", height: "13vh" }}
      />
    </div>
  );
};

export default Logo;
