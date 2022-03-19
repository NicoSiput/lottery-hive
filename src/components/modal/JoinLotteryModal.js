import React, { useEffect, useState } from 'react';
import BaseModal from './BaseModal';
import axios from 'axios';

export default function JoinLotteryModal({
  isOpen,
  shouldCloseOnOverlayClick,
  data,
  onSubmit,
  onRequestClose,
}) {
  const [value, setValue] = useState(0);
  const [ethToUsd, setEthToUsd] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [estimateUSD, setEstimateUSD] = useState(0);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const getBtcPrice = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
        );
        setEthToUsd(response.data.USD);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getBtcPrice();
  }, []);

  const handlerOnChangeETH = (e) => {
    const { value } = e.target;
    if (!value) {
      setValue(0);
      setEstimateUSD(0);
      setShowError(true);
    } else {
      if (ethToUsd > 0) {
        setEstimateUSD(value * ethToUsd);
      }
      setValue(e.target.value);
      setShowError(false);
    }
  };

  return (
    <BaseModal
      maxWidth={440}
      isOpen={isOpen}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      onRequestClose={onRequestClose}
    >
      <div className="rounded-lg">
        {/* NOTE header modal */}
        <div className="flex items-center justify-between rounded-t-lg bg-bee-main font-bold text-sm text-bee-main border-b p-5">
          <p>OFFER A NECTAR</p>
          <button
            className="flex justify-center items-center"
            onClick={onRequestClose}
          >
            CLOSE
          </button>
        </div>

        {/* NOTE body modal */}
        <div className="rounded-b-lg font-normal bg-bee-secondary text-white text-sm p-10">
          <div className="container text-modal-text">
            <div className="mt-3">
              <p className='text-bee-black font-semibold'>Offering Amount :</p>
              <div className="flex mt-3">
                <span className="text-sm font-semibold border-2 rounded-l px-4 py-2 bg-bee-honey text-white whitespace-no-wrap">
                  ETH
                </span>
                <input
                  type="number"
                  id="search"
                  step='0.01'
                  min="0.01"
                  className="border border-gray-300  text-sm rounded-r-md block w-full focus:border-black focus-visible:outline-none py-2 px-4 "
                  placeholder="Enter amount of ETH"
                  value={value}
                  onChange={handlerOnChangeETH}
                />
              </div>
              <p className="text-xs mt-1 font-bold">
                *) NOTE: Minimum 0.01 eth for join the lottery
              </p>
            </div>

            <hr className="my-3" />

            <div className="mt-2 bg-bee-main rounded-lg p-4 text-right">
              <h3 className="text-sm text-white">Estimated USD</h3>
              <h4 className="text-2xl mt-3 text-white font-bold">$ {estimateUSD.toFixed(2)}</h4>
              <p className="text-white text-xs mt-1">
                *) Bid frequently to grow your winning chance
              </p>
            </div>

            <button
              onClick={async () => {
                setIsLoading(true);
                if (value === 0) {
                  setShowError(true);
                  setIsLoading(false);
                } else {
                  await onSubmit(value);
                  setIsLoading(false);
                  onRequestClose();
                  setValue(0);
                  setEstimateUSD(0);
                }
              }}
              className="button-offer-submit text-lg font-bold w-full py-3 mt-3 rounded-full cursor-pointer shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Presenting your offering ..' : 'Offer'}
            </button>
            <p className={"text-red-500 font-semibold text-sm mt-1 "+ (showError ? '' : 'hidden')}>
              ETH amount can't be zero
            </p>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
