import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import { signEthereumMessage, utils } from "@cerc-io/nitro-client-browser";

import { nitroKeyAtom } from "../atoms/nitroKeyAtom";
import { nitroAtom } from "../atoms/nitroAtom";

const EMPTY_VOUCHER_HASH = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'; // keccak256('0x')

export default function useSignedEmptyVoucher() {
  const [nitroKey] = useAtom(nitroKeyAtom);
  const [nitro] = useAtom(nitroAtom);
  const [state, setState] = useState({
    vhash: EMPTY_VOUCHER_HASH
  })

  useEffect(() => {
    const signMessage = async () => {
      let signer;

      // TODO: Setup nitro or keySigner at app start and generate empty signed voucher
      if (nitro) {
        // Sign with signer from Nitro client
        signer = nitro.nitroSigner
      } else {
        if (nitroKey) {
          // Sign with random nitroKey if present
          signer = new utils.KeySigner(nitroKey)
          await signer.init();
        }
      }

      if (signer) {
        const signature = await signEthereumMessage(Buffer.from(EMPTY_VOUCHER_HASH), signer);
        const vsig = utils.getJoinedSignature(signature)
        setState(state => ({ ...state, vsig }))
      }
    }

    signMessage()
  }, [nitroKey, nitro])

  return state
}
