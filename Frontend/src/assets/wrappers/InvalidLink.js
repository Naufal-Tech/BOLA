import styled from "styled-components";

const Wrapper = styled.main`
  min-height: 100vh;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  .invalid-image {
    width: 350px; /* Adjust the desired width here */
    max-width: 100%;
    display: block;
    margin-bottom: 2rem;
    margin-left: 5rem;
    margin-top: 2rem; /* Increase this value to center the image more */
  }
  h3 {
    margin-bottom: 0.5rem;
  }
  p {
    line-height: 1.5;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    color: var(--text-secondary-color);
  }
  .button-container {
    margin-top: 2rem;
  }
  .button-link {
    color: white;
    background-color: var(
      --primary-500
    ); /* Replace with the desired background color */
    text-transform: capitalize;
    padding: 5px 10px;
    border-radius: 10px;
    text-decoration: none;
  }
`;

export default Wrapper;
