const InputLabelUp = ({
  label,
  type,
  register,
  error,
  endIcon,
  ...props
}: any) => {
  return (
    <div>
      <div>
        <label className="block pb-2">{label}</label>
        <div className="flex flex-col">
          <div className="relative form-control bg-transparent text-white border-2 border-orange-400 p-2 rounded-lg h-12">
            <input
              type={type}
              {...register}
              {...props}
              className="form-control bg-transparent text-white outline-none p-1 w-full placeholder-gray-500"
            />
            {endIcon && (
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 outline-none">
                {endIcon}
              </span>
            )}
          </div>
          {error && <span className="text-red-500">{error.message}</span>}
        </div>
      </div>
    </div>
  );
};

export default InputLabelUp;
