import logo from "../assets/images/logo.svg";

const Logo = () => {
  return (
    <img
      src={logo}
      alt="job-logo"
      className="logo"
      style={{
        width: "400px",
        height: "200px",
        marginTop: "10px",
        marginLeft: "-30px",
      }}
    />
  );
};

export default Logo;
