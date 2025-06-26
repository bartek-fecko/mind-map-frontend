import NextLink from 'next/link';

type LinkProps = {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

const Link: React.FC<LinkProps> = ({ href, children, onClick, className }) => {
  return (
    <NextLink
      href={href}
      onClick={onClick}
      className={`
        text-[14px] leading-[22px] font-normal
        text-[#636AE8FF]
        ${className ?? ''}
      `}
    >
      {children}
    </NextLink>
  );
};

export default Link;
