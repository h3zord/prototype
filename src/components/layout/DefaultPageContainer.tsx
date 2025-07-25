interface DefaultPageContainerProps {
  children: React.ReactNode;
  title?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  customPadding?: string;
}

const DefaultPageContainer = ({
  children,
  paddingTop = "pt-0",
  paddingRight = "pr-4",
  paddingBottom = "pb-4",
  paddingLeft = "",
  customPadding,
}: DefaultPageContainerProps) => {
  const paddingClasses =
    customPadding ||
    `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`;

  return (
    <div className="h-full flex w-full justify-center">
      <div className={`w-full h-full flex flex-col ${paddingClasses}`}>
        {children}
      </div>
    </div>
  );
};

export default DefaultPageContainer;
