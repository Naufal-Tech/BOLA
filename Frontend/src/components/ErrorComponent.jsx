import { useRouteError } from "react-router-dom";

const ErrorComponent = () => {
  const error = useRouteError();
  console.log(error);
  return (
    <div>
      <h4>There was an error...</h4>
    </div>
  );
};

export default ErrorComponent;
