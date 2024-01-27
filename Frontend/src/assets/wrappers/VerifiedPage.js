import styled from "styled-components";

const Wrapper = styled.section`
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    height: 6rem;
    display: flex;
    align-items: center;
    margin: 0 auto;
  }
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -6rem;
  }
  .d-flex {
    display: flex;
  }

  .justify-content-center {
    justify-content: center;
  }
  .align-items-center {
    align-items: center;
  }
  h1 {
    font-weight: 700;
    font-size: 2.5rem !important;
    span {
      color: var(--primary-500);
      margin-bottom: 0.5rem;
    }
  }
  p {
    line-height: 2;
    color: var(--text-secondary-color);
    margin-bottom: 1.5rem;
    max-width: 35em;
  }
  .register-link {
    margin-right: 1rem;
  }
  .main-img {
    display: none;
  }
  .img {
    max-width: 100%; /* Make sure the image doesn't overflow its container */
    margin-bottom: 1rem; /* Adjust margin as needed */
  }
  .btn {
    padding: 0.75rem 1rem;
  }
  .info {
    text-align: center;
    max-width: 35em;
  }
  /* Add this CSS to center the button */
  .centered-btn {
    margin-top: 2rem; /* Adjust the margin as needed */
    align-items: center;
    justify-content: center;
  }
  .container.page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  .text-center {
    text-align: center;
  }
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 400px;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
  }
`;
export default Wrapper;
