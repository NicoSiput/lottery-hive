import React from 'react';

export default function Header() {
  return (
    <header className="bg-bee-main body-font py-2 shadow-md sticky">
      <div className="container flex items-center">
        <img src="images/ethersphere.png" alt="Logo" className="rounded-full h-12 w-12" />
        <p className="text-xl text-bee-main font-bold p-3">Lottery Hive</p>
      </div>
    </header>
  );
}
