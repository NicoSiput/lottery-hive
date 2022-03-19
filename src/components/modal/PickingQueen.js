import React, { useEffect, useState } from 'react';

import BaseModal from './BaseModal';
import axios from 'axios';

export default function ConfirmQtyModal({
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
    } else {
      if (ethToUsd > 0) {
        setEstimateUSD(value * ethToUsd);
      }
      setValue(e.target.value);
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
        <div className="flex items-center justify-between rounded-t-lg bg-modal-header font-bold text-sm text-white border-b p-5">
          <p>JOIN</p>
          <button
            className="flex justify-center items-center"
            onClick={onRequestClose}
          >
            CLOSE
          </button>
        </div>

        {/* NOTE body modal */}
        <div className="rounded-b-lg font-normal bg-modal-body text-white text-sm p-10">
          <div className="container text-modal-text">
            <h3>Total Player:</h3>
            <p className="text-lg">{data?.players?.length ?? 0}</p>

            <div className="mt-3">
              <p>Buy :</p>
              <div className="flex mt-3">
                <span className="text-sm  border-2 rounded-l px-4 py-2 bg-gray-300 text-white whitespace-no-wrap">
                  ETH
                </span>
                <input
                  type="number"
                  id="search"
                  className="border border-gray-300  text-sm rounded-r-md block w-full focus:border-black focus-visible:outline-none py-2 px-4 "
                  placeholder="Enter amount of ETH"
                  onChange={handlerOnChangeETH}
                />
              </div>
              <p className="text-xs mt-1 font-bold">
                *) NOTE: Minimum 0.01 eth for join the lottery
              </p>
            </div>

            <hr className="my-3" />

            <div className="mt-2 bg-modal-header rounded-lg p-4 text-right">
              <h3 className="text-sm">Estimated USD</h3>
              <h4 className="text-2xl mt-3">$ {estimateUSD}</h4>
              <p className="font-bold text-white text-xs mt-1">
                *) Draw will notice on our Discord.
              </p>
            </div>

            <button
              onClick={async () => {
                setIsLoading(true);
                await onSubmit(value);
                setIsLoading(false);
                onRequestClose();
                setValue(0);
                setEstimateUSD(0);
              }}
              className="bg-cyan-200 text-white font-bold w-full py-3 mt-3 rounded-full cursor-pointer hover:bg-cyan-500"
              disabled={isLoading}
            >
              {isLoading ? 'please wait' : 'pay'}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
