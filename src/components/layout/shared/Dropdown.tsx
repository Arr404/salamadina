"use client";

import type {
  ReactNode,
  ElementType} from "react";

import React, {
  useState,
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";

import Link from "next/link";

import { Transition } from "@headlessui/react";

interface DropdownContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleOpen: () => void;
}

const DropDownContext = createContext<DropdownContextType | undefined>(undefined);

interface DropdownProps {
  children?: ReactNode;
  as?: ElementType;
  className?: string;
}

const Dropdown = ({ as: Component = "div", children, className }: DropdownProps) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const dropdownElement = dropdownRef.current;

      if (dropdownElement && event.target instanceof Node && !dropdownElement.contains(event.target)) {
        if (open) {
          toggleOpen();
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [open, toggleOpen]);





  return (
    <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
      <Component ref={dropdownRef} className={`dropdown ${className || ""}`}>
        {children}
      </Component>
    </DropDownContext.Provider>
  );
};

interface TriggerProps {
  children: ReactNode;
  type?: ElementType;
  className?: string;
  id?: string;
}

export const Trigger: React.FC<TriggerProps> = ({ type, children, className, id }) => {
  const { open, toggleOpen } = useContext(DropDownContext)!;

  return type === "a" ? (
    <Link
      id={id}
      href="#"
      onClick={(e) => {
        e.preventDefault();
        toggleOpen();
      }}
      className={`${className || "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"} ${open ? "show" : ""}`}
    >
      {children}
    </Link>
  ) : (
    <button id={id} onClick={toggleOpen} className={className || "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>
      {children}
    </button>
  );
};

interface ContentProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  placement?: "right-end" | "start-end" | "top-end" | "bottom-start" | "bottom-end" | "top-start";
}

const Content: React.FC<ContentProps> = ({ as: Component = "div", className, children, placement }) => {
  const { open, setOpen } = useContext(DropDownContext)!;
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [placementState, setPlacement] = useState(placement || "right-end");

  useEffect(() => {
    if (placement) setPlacement(placement);
  }, [placement]);

  const getDropdownStyle = () => {
    if (!open || !dropdownRef.current) return {};
    const dropdownElement = dropdownRef.current;

    if ('style' in dropdownElement) {
      dropdownElement.style.position = 'absolute'
      dropdownElement.style.margin = "0px";
    }


    const placementStyles: Record<string, string> = {
      "right-end": "translate(0px, 54px)",
      "start-end": "translate(0px, 20px)",
      "top-end": "translate(-58px, -30px)",
      "bottom-start": "translate(0px, 54px)",
      "bottom-end": "translate(0px, 39px)",
      "top-start": "translate(0px, -95px)",
    };

    if ('style' in dropdownElement) {
      dropdownElement.style.transform = placementStyles[placementState] || ''
    }

    return {};
  };

  return (
    <Transition as={React.Fragment} show={open}>
      {(status: any) => (
        <Component
          ref={dropdownRef}
          onClick={() => setOpen(false)}
          className={`absolute z-50 py-2 mt-1 bg-white rounded-md shadow-md dropdown-menu min-w-max ${className || ""} ${
            status === "entered" ? "transition-all" : ""
          }`}
          style={getDropdownStyle()}
        >
          {children}
        </Component>
      )}
    </Transition>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;

export { Dropdown };
