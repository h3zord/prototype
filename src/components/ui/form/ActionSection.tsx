interface ActionSectionProps {
  title?: string;
  children: React.ReactNode;
}

const ActionSection = ({ title, children }: ActionSectionProps) => {
  return (
    <div className="relative">
      <h2 className="text-xl text-white pl-2">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 py-6 border-b border-gray-300/[.30]">
        {children}
      </div>
    </div>
  );
};

export default ActionSection;
