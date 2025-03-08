const Divider: React.FC<{ className?: string }> = ({ className }) => {
  return <hr className={`my-8 border-gray-300 ${className || ""}`} />;
};

export default Divider;
