import config from "./config";

const { chainId, address, name } = config;

const contractInfo = {
  chainId,
  name,
  verifyingContract: address,
};
export default contractInfo;
