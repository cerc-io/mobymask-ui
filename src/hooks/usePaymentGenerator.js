import React, { useEffect } from "react";
import { useAtom } from "jotai";

import { utils } from "@cerc-io/nitro-node-browser";
import { gql } from "@apollo/client";

import { nitroAtom } from "../atoms/nitroAtom";
import { watcherPaymentChannelIdAtom } from "../atoms/watcherPaymentChannelIdAtom";
import { payAmountAtom } from "../atoms/payAmountAtom";
import useLazyQuery from "./useLazyQuery";
import RATES_GRAPHQL from "../queries/rates";

const RATES_GQL = gql(RATES_GRAPHQL);

export default function usePaymentGenerator() {
  const [nitro] = useAtom(nitroAtom);
  const [watcherPaymentChannelId] = useAtom(watcherPaymentChannelIdAtom);
  const [payAmount] = useAtom(payAmountAtom);

  const rates = useLazyQuery(RATES_GQL, {
    fetchPolicy: "no-cache"
  });

  useEffect(() => {
    if (!nitro) {
      return;
    }

    const updateRates = async () => {
      const { data: { _rates_: fetchedRates } } = await rates();
      console.log('fetchedRates', fetchedRates);
      // TODO: Update snap with fetched rates
    }

    updateRates();
  }, [nitro])

  return React.useCallback(async () => {
    if (!nitro) {
      throw new Error('Setup Nitro client before making payment');
    }

    if (!watcherPaymentChannelId) {
      throw new Error('Create payment channel with watcher before making payment');
    }

    const voucher = await nitro.pay(watcherPaymentChannelId, payAmount);

    return {
      vhash: voucher.hash(),
      vsig: utils.getJoinedSignature(voucher.signature)
    }
  }, [nitro, watcherPaymentChannelId, payAmount]);
}
