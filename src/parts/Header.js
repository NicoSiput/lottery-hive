import React from 'react';

export default function Header() {
  return (
    <header className="bg-bee-main body-font py-2 shadow-md sticky">
      <div className="container flex items-center justify-center">
        <img
          src="/images/bee-cafe-logo.svg"
          alt="Logo"
          className="rounded-full h-12 w-20"
        />
        <span className="text-xl text-white font-bold">Lottery Hive</span>
      </div>
    </header>
  );
}
