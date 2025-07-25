interface UnnamedFormSectionProps {
  children: React.ReactNode;
}

const UnnamedFormSection = ({ children }: UnnamedFormSectionProps) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-700 p-6 rounded-md">
        {children}
      </div>
    </div>
  );
};

export default UnnamedFormSection;
