/** @format */

import { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  className?: string;
  containerClassName?: string;
  _ref?: any;
}

const MainBox: FC<Props> = ({
  className,
  containerClassName,
  _ref,
  children,
}) => {
  return (
    <div className={containerClassName}>
      <div
        ref={_ref}
        className={`max-w-[1600px] m-auto overflow-hidden text-white px-3 lg:px-10 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export { MainBox };
