import { Link } from "react-router-dom";
import invalid from "../assets/images/void.svg";
import Wrapper from "../assets/wrappers/InvalidLink";

const InvalidLink = () => {
  return (
    <Wrapper>
      <div>
        <img src={invalid} alt="invalid-link" className="invalid-image" />
        <h3>Your Verification Link is Expired</h3>
        <p>Please request a new verification link on the Login Page.</p>
        <div className="button-container">
          <Link className="button-link" to="/login">
            Return to Login
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};

export default InvalidLink;
