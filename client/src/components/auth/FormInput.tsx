import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";

type FormInputProps = {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register: any;
  toggleVisibility?: boolean;
};

const FormInput = ({
  label,
  type = "text",
  placeholder,
  error,
  register,
  toggleVisibility = false,
}: FormInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <label className="dark:text-gray-300 text-neonblue text-sm">
        {label}
      </label>
      <input
        type={toggleVisibility ? (show ? "text" : "password") : type}
        placeholder={placeholder}
        {...register}
        className="w-full px-4 py-2 bg-transparent border-2 border-neonblue rounded text-neonblue dark:text-white dark:placeholder-gray-400 placeholder-neonblue/50 pr-10"
      />
      {toggleVisibility && (
        <span
          className="absolute right-3 top-9 cursor-pointer dark:text-gray-400 text-neonblue"
          onClick={() => setShow(!show)}
        >
          {show ? <FiEyeOff /> : <FiEye />}
        </span>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FormInput;
