"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  label: string;
}

export default function Accordion({ items, label }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setOpenIds((current) =>
      current.includes(id)
        ? current.filter((openId) => openId !== id)
        : [...current, id],
    );
  };

  return (
    <ul aria-label={label} className="flex flex-col">
      {items.map((item, index) => {
        const isOpen = openIds.includes(item.id);
        const panelId = `accordion-panel-${item.id}`;
        const buttonId = `accordion-button-${item.id}`;

        return (
          <li key={item.id} className="border-t border-gray/40 last:border-b">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                data-cursor={isOpen ? "Cerrar" : "Abrir"}
                className="group flex w-full items-center gap-scale py-6 text-left focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span className="w-12 shrink-0 text-body text-gray">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-2xl font-medium text-white transition-colors duration-300 fine:group-hover:text-secondary md:text-3xl">
                  {item.title}
                </span>
                <ChevronDownIcon
                  aria-hidden="true"
                  className={`pointer-events-none size-6 shrink-0 text-gray transition-transform duration-300 ease-out ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              {...(isOpen ? {} : { inert: "" as unknown as boolean })}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="flex flex-col gap-scale pb-8 md:pl-16">
                  {item.content}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
