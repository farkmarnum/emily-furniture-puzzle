import { useEffect, useState } from "react";
import { getUnit } from "./constants";

const useUnit = (): number => {
  const [unit, setUnit] = useState<number>(getUnit());

  useEffect(() => {
    const handleResize = () => {
      setUnit(getUnit());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return unit;
};

export default useUnit;