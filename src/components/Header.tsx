"use client";

import { useUser, ClerkLoaded, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import Form from "next/form";
import { ShoppingCartIcon, PackageIcon } from "lucide-react";
import useBasketStore from "../../store/store";

function Header() {
  const { user } = useUser();
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  console.log(user);
  return (
    <header className="flex flex-wrap justify-between items-center px-4 py-2">
      {/* Top Row */}
      <div className="flex w-full flex-wrap justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-orange-500 hover:opacity-50 cursor-pointer mx-auto sm:mx-0"
        >
          Minje Webshop
        </Link>
        <Form
          action="/search"
          className="w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0"
        >
          <input
            type="text"
            name="query"
            placeholder="Search for products"
            className="bg-grey-100 text-grey-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 border w-full max-w-4xl"
          />
        </Form>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0 flex-1 sm:flex-none">
          <Link
            href="/basket"
            className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-orange-500 hover-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {itemCount}
            </span>
            <span>My Cart</span>
          </Link>

          {/* User area*/}
          <ClerkLoaded>
            {user && (
              <Link
                href="/orders"
                className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-orange-500 hover-orange-700 text-white font-bold py-2 px-4 rounded"
              >
                <PackageIcon className="w-6 h-6" />

                <span>My Orders</span>
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-2">
                <UserButton />
                <div className="hidden sm:block text-xs">
                  <p className="text-gray-400">Welcome Back</p>
                  <p className="font-bold">{user.fullName}!</p>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal" />
            )}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}

export default Header;
