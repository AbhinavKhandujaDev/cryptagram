const Spinner = (props: any) => {
  const { size = "sm", color = "white" } = props;
  return (
    <span
      className={`spinner-border text-${color} spinner-border-${size}`}
      role="status"
      aria-hidden="true"
    />
  );
};

export default Spinner;
