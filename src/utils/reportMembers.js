import { ethers } from "ethers";
import contractInfo from "./contractInfo";
const { createMembership } = require("eth-delegatable-utils");
const { abi } = require("./artifacts");
const { address } = require("./config.json");

export default async function reportMembers({
  members,
  provider,
  invitation,
  peer = null
}) {
  const membership = createMembership({
    contractInfo,
    invitation,
  });

  let registry = new ethers.Contract(address, abi);

  if (provider) {
    const wallet = provider.getSigner();
    registry = await attachRegistry(registry, wallet);
  }

  const invocations = await Promise.all(
    members.map(async (member) => {
      const _member = member.indexOf("@") === "0" ? member.slice(1) : member;
      const desiredTx = await registry.populateTransaction.claimIfMember(
        `TWT:${_member.toLowerCase()}`,
        true,
      );
      const invocation = {
        transaction: {
          to: address,
          data: desiredTx.data,
          gasLimit: 500000,
        },
      };
      return invocation;
    }),
  );

  const queue = Math.floor(Math.random() * 100000000);
  const signedInvocations = membership.signInvocations({
    batch: invocations,
    replayProtection: {
      nonce: 1,
      queue,
    },
  });

  if (peer) {
    // Broadcast invocations on the network
    return peer.floodMessage(
      MOBYMASK_TOPIC,
      {
        kind: MESSAGE_KINDS.INVOKE,
        message: [signedInvocations]
      }
    );
  }

  return await registry.invoke([signedInvocations]);
}

async function attachRegistry(signer) {
  const Registry = new ethers.Contract(address, abi, signer);
  const _registry = await Registry.attach(address);
  const deployed = await _registry.deployed();
  return deployed;
}
