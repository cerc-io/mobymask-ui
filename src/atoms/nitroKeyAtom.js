import { ethers } from "ethers";
import { atomWithStorage } from "jotai/utils";

const wallet = ethers.Wallet.createRandom()

export const nitroKeyAtom = atomWithStorage(
  "nitroKey",
  localStorage.getItem("nitroKey") || wallet.privateKey
);
