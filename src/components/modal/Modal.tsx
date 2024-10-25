/** @format */
import classNames from "classnames";
import { FC, MutableRefObject, ReactNode, useEffect, useRef } from "react";
import { useClickOutside, useLockPage } from "../../hooks";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}
const Modal: FC<Props> = ({ children, open, setOpen, className }) => {
  const ref = useRef() as MutableRefObject<HTMLDivElement>;
  const { lockScroll, unlockScroll } = useLockPage();
  useClickOutside(ref, () => setOpen(false));

  useEffect(() => {
    if (open) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }, [open]);

  return (
    <>
      <div
        className={classNames(
          `fixed z-[1001] transform m-auto left-0 !h-[100vh] transition-all-3 top-0 duration-300 `,
          {
            "inset-0 open-modal": open,
            "inset-0 close-modal": !open,
          }
        )}
      >
        <div className="flex items-center min-h-screen px-4 py-8">
          <div
            className={classNames(
              `w-full max-w-4xl p-5 z-20 mx-auto m-auto transition-all-3 duration-300 bg-white rounded-2xl shadow-lg ${className}`,
              {
                "opacity-100 scale-100": open,
                "opacity-0 scale-0": !open,
              }
            )}
            ref={ref}
          >
            {children}
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 h-screen w-screen bg-black z-20 opacity-70"></div>
      )}
    </>
  );
};

export { Modal };
