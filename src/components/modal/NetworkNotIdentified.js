import React, { useEffect, useState } from 'react';
import BaseModal from './BaseModal';
import axios from 'axios';

export default function NetworkNotIdentified({
  isOpen,
  shouldCloseOnOverlayClick
}) {
  return (
    <BaseModal
      maxWidth={440}
      isOpen={isOpen}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
    >
      <div className="rounded-lg">
        {/* NOTE header modal */}
        <div className="flex items-center justify-center rounded-t-lg bg-bee-main font-bold text-sm text-bee-main border-b p-5">
          <p className="text-center">WARNING</p>
        </div>

        {/* NOTE body modal */}
        <div className="rounded-b-lg font-normal bg-bee-secondary text-white text-sm p-10">
          <div className="container text-center">
            <span className='font-bold text-bee-black text-xl'>Network not Identified !</span>
            <br/>
            <span className='font-bold text-3xl text-purple-900 animate-pulse'>Hard refresh the Page</span>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
