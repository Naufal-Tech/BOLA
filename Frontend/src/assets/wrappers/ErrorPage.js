import styled from "styled-components";

const WrapperError = styled.main`
  min-height: 100vh;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 90vw;
    max-width: 600px;
    display: block;
    margin-bottom: 2rem;
    margin-top: -3rem;
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
    background-color: var(--primary-500);
    text-transform: capitalize;
    padding: 10px 10px;
    border-radius: 10px;
    text-decoration: none;
    cursor: pointer; /* Add this line to set the cursor to pointer */
  }
`;

export default WrapperError;
