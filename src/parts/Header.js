import React, { useEffect, useState } from 'react';
import UAuth from '@uauth/js';

export default function Header() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkUnstoppable = async () => {
      try {
        const uauth = new UAuth({
          clientID: process.env.REACT_APP_UNSTOPPABLE_CLIENT_ID,
          redirectUri: process.env.REACT_APP_UNSTOPPABLE_REDIRECT_URI,
        });

        const account = await uauth.user();
        setCurrentUser(account);
      } catch (error) {
        console.log(error);
      }
    };

    checkUnstoppable();
  }, []);

  return (
    <header className="bg-bee-main body-font py-2 shadow-md sticky">
      <div className="container flex justify-between items-center">
        <p className="text-xl text-bee-main font-bold p-3">Lottery Hive</p>
        {currentUser && (
          <p className="text-white border p-3 rounded-full">{currentUser.sub}</p>
        )}
      </div>
    </header>
  );
}
