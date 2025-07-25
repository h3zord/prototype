interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <div className="relative">
      <div className=" bg-gray-800 text-white px-4 py-1 rounded-t-md border-2 border-b-0 border-gray-700 w-max">
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-700 p-4 rounded-tl-none rounded">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
