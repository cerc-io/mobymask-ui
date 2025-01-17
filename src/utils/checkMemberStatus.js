import { getPaymentHeader } from "./getPaymentHeaders";

export const checkMemberStatus = async (id, latestBlock, isMember, signedVoucher) => {
  let codedName = sanitizeValue(id.toLowerCase());

  try {
    const headers = {
      'X-Payment': getPaymentHeader(signedVoucher)
    }

    const { data: latestBlockData } = await latestBlock({}, headers);
    const { data } = await isMember(
      {
        blockHash: latestBlockData?.latestBlock?.hash,
        key0: codedName,
      },
      headers
    );
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export function sanitizeValue(value) {
  value = value.indexOf("@") === 0 ? value.slice(1) : value;

  return `TWT:${value}`;
}

export const endorseHandle = ({
  store,
  setStore,
  clearMember = () => {},
  member,
  checkResult,
}) => {
  const isMember = store.find((item) => item.name === member);
  if (!isMember && member) {
    const info = {
      name: member,
      status: checkResult ? "yes" : "no",
    };
    setStore([...store, info]);
  }
  clearMember("");
};
