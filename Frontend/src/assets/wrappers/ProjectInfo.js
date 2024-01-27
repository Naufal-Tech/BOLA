import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  .project-icon {
    font-size: 1rem;
    margin-right: 0.5rem; /* Adjusted spacing */
    display: flex;
    align-items: center;
    svg {
      color: var(--text-secondary-color);
    }
  }
  .project-text {
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
  }
`;
export default Wrapper;
