"use client"
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import Link from 'next/link';

const navigation = [
  { name: 'Work', href: 'work', current: true },
  { name: 'Experience', href: 'experience', current: false },
  { name: 'Skills', href: 'skills', current: false },
  { name: 'About', href: 'about', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();
    if (pathname === "/") {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/`);
      setTimeout(() => {
        setTimeout(() => {
          document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
        }, 500);
      });
    }
  };
  return (
    <Disclosure as="nav" className=" sticky top-0 z-50 bg-black/10 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-black hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset mr-4">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden text-white" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block text-white" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-start">
            <div className="flex shrink-0 items-center ml-6 md:ml-0">
              <Link
                href="#home"
                onClick={(e) => handleClick(e, "home")}
              >
                <Image
                  alt="Your Company"
                  src="/myself-emoji.svg"
                  className="h-8 w-auto"
                  width={10}
                  height={10}
                />
              </Link>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    href={`#${item.href}`}
                    onClick={(e) => handleClick(e, item.href)}
                    key={item.name}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? ' text-black' : 'hover:bg-secondary hover:text-white text-black',
                      'px-4 py-1 text-sm font-medium rounded-3xl bg-secondary',
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={`#${item.href}`}
              onClick={(e) => handleClick(e, item.href)}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-green-400 text-white' : 'text-gray-300',
                'block rounded-md px-3 py-2 text-base font-medium text-white bg-primary',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
