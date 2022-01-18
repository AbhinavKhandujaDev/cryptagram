interface SwitchProps {
  text?: string;
  id: string;
}

const Switch = (props: SwitchProps) => {
  return (
    <div className="Switch form-check form-switch">
      <input className="form-check-input" type="checkbox" id={props.id} />
      <label className="form-check-label" htmlFor={props.id}>
        {props.text}
      </label>
    </div>
  );
};

export default Switch;
