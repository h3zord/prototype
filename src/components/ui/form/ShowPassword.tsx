import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";

interface ShowPasswordProps {
  showPassword: boolean;
}

const ShowPassword: React.FC<ShowPasswordProps> = ({ showPassword }) => {
  return (
    <>
      {showPassword ? (
        <FaRegEyeSlash className="text-white outline-none" />
      ) : (
        <MdOutlineRemoveRedEye className="text-white outline-none" />
      )}
    </>
  );
};

export default ShowPassword;
