import { Link } from "react-router-dom";

export type LogoItem = {
  src: string;
  alt: string;
  to?: string;
  onClick?: () => void;
  className?: string; //om jag vill ha mer styling
};

export const Logo = ({ src, alt, to, onClick, className }: LogoItem) => {
  const logoImg = (
    <img
      src={src}
      alt={alt}
      className={`h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 transition-transform duration-200 hover:scale-110 ${className ?? ""}`}
    />
  );
  return (
    <>
      {to ? (
        <Link to={to} className="flex items-center" aria-label={alt}>
          {logoImg}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="flex items-center"
          aria-label={alt}
        >
          {logoImg}
        </button>
      )}
    </>
  );
};
