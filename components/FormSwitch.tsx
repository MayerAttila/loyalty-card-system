import { useEffect, useRef, useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";

type FormSwitchItem = {
  key: string;
  label: string;
  status?: boolean;
};

type FormSwitchProps = {
  items?: FormSwitchItem[];
  activeKey?: string | null;
  onChange?: (key: string) => void;
};

const FormSwitch = ({
  items = [],
  activeKey = null,
  onChange = () => {},
}: FormSwitchProps) => {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [slideStyle, setSlideStyle] = useState({ width: 0, left: 0 });

  useEffect(() => {
    const activeIndex = items.findIndex((item) => item.key === activeKey);
    if (activeIndex === -1) return;

    const activeButton = buttonRefs.current[activeIndex];
    if (activeButton) {
      const { offsetWidth, offsetLeft } = activeButton;
      setSlideStyle((prev) => {
        if (prev.width === offsetWidth && prev.left === offsetLeft) {
          return prev;
        }
        return {
          width: offsetWidth,
          left: offsetLeft,
        };
      });
    }
  }, [activeKey, items]);

  return (
    <div
      className="relative inline-flex items-center space-x-1 rounded-full bg-accent-2 p-1 shadow-[inset_0_2px_4px_rgba(15,23,42,0.08)]"
    >
      <div
        className="absolute rounded-full bg-primary shadow-md transition-all duration-[350ms] ease-in-out"
        style={{
          width: slideStyle.width,
          height: "calc(100% - 8px)",
          top: "4px",
          left: slideStyle.left,
        }}
      />

      {items.map((item, idx) => (
        <button
          key={item.key}
          ref={(el) => {
            buttonRefs.current[idx] = el;
          }}
          onClick={() => onChange(item.key)}
          className={`relative z-10 rounded-full px-5 py-2 text-xs font-semibold transition-colors duration-300 sm:text-sm ${
            activeKey === item.key
              ? "text-contrast"
              : "text-contrast/70"
          }`}
        >
          {typeof item.status === "boolean" ? (
            <div className="flex items-center space-x-2">
              <span>{item.label}</span>
              {item.status ? (
                <FaRegCircleCheck className="text-brand" size={20} />
              ) : (
                <IoCloseCircleOutline className="text-contrast/60" size={20} />
              )}
            </div>
          ) : (
            <span>{item.label}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FormSwitch;
