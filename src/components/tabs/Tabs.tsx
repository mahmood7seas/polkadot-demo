/** @format */
import {
  FC,
  ReactNode,
  useCallback,
  useState,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import classNames from "classnames";

interface TabProps {
  title: string;
  children: ReactNode;
  index?: number;
  isActive?: boolean;
  isActiveClassName?: string;
  className?: string;
  handleTab?: (index: number, tabName: string) => void;
  onCustomClick?: () => void;
  tabInModal?: boolean;
}

const Tab: FC<TabProps> = ({
  title,
  index,
  isActive = true,
  className = "",
  isActiveClassName,
  handleTab,
  onCustomClick,
  tabInModal = false,
}) => {
  return (
    <li
      className={classNames(
        tabInModal
          ? `flex flex-row py-2 md:text-sm xl:text-sm text-center transition duration-500 mx-2 cursor-pointer w-fit hover:text-secondary ${className}`
          : `cursor-pointer text-lg font-semibold ${className}`,
        {
          [isActiveClassName || ""]: isActive,
          "": !isActive,
        }
      )}
      onClick={() => {
        handleTab?.(index || 1, title);
        onCustomClick?.();
      }}
    >
      {title}
    </li>
  );
};

interface TabsProps {
  children: ReactNode;
  className?: string;
  isActiveClassName?: string;
  activeTab?: number;
  onTabChange?: (currentTabIndex: number) => void;
}

const Tabs: FC<TabsProps> = ({
  children,
  className = "",
  isActiveClassName = "gradient-text",
  activeTab = 1,
  onTabChange,
}) => {
  const [tabIndex, setTabIndex] = useState(activeTab);

  const getIsActive = useCallback(
    (index: number, tabName: string) => {
      console.log(tabName);
      return index + 1 === tabIndex;
    },
    [tabIndex]
  );

  const handleTab = useCallback(
    (index: number, tabName: string) => {
      console.log(tabName);
      onTabChange?.(index);
      setTabIndex(index);
    },
    [onTabChange]
  );

  return (
    <div className="flex flex-col justify-between w-full">
      <ul
        className={`flex gap-x-2 flex-wrap md:flex-nowrap md:justify-start justify-center ${className}`}
      >
        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) return null;
          return cloneElement(child, {
            ...child.props,
            isActive: getIsActive(index, child.props.title),
            index: index + 1,
            isActiveClassName,
            handleTab,
          });
        })}
      </ul>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return null;
        return (
          getIsActive(index, child.props.title) && (
            <div className="h-full">{cloneElement(child.props.children)}</div>
          )
        );
      })}
    </div>
  );
};

export { Tabs, Tab };
