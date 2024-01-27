import logoLogin from "../assets/images/logoLogin.svg";

const LogoLogin = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "30vh",
        marginBottom: "5vh",
      }}
    >
      <img
        src={logoLogin}
        alt="logo-login"
        className="logo"
        style={{
          width: "350px",
          height: "200px",
        }}
      />
    </div>
  );
};

export default LogoLogin;
