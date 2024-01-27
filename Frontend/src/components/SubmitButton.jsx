// eslint-disable-next-line react/prop-types
const SubmitButton = ({ isSubmitting, formBtn, label }) => {
  return (
    <button
      type="submit"
      className={`btn btn-block ${formBtn && "form-btn"}`}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Submitting" : label || "Submit"}
    </button>
  );
};

export default SubmitButton;
