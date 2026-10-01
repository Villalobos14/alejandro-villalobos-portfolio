import { TransitionLink } from "@/components/curtain/TransitionLink";

export type AboutView = "professional" | "fun";

interface AboutSubNavProps {
  active: AboutView;
}

const views: { id: AboutView; label: string; href: string }[] = [
  { id: "professional", label: "Professional", href: "/about" },
  { id: "fun", label: "Fun", href: "/fun" },
];

export default function AboutSubNav({ active }: AboutSubNavProps) {
  return (
    <nav aria-label="About sections">
      <ul className="flex items-center gap-2 rounded-full border border-gray/40 p-1">
        {views.map((view) => {
          const isActive = view.id === active;

          return (
            <li key={view.id}>
              <TransitionLink
                href={view.href}
                aria-current={isActive ? "page" : undefined}
                data-cursor={`Ir a ${view.label}`}
                className={`block rounded-full px-5 py-2 text-label transition-colors duration-300 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  isActive
                    ? "bg-secondary text-black"
                    : "text-gray fine:hover:text-white"
                }`}
              >
                {view.label}
              </TransitionLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
