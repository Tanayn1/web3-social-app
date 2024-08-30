import { GenerateLensApiRelayAddressDocument, HandleToProfileIdDocument } from "@/lens-protocol/graphql/generated";
import { client } from "./apolloClient";
import { ethers } from "ethers";
import abi from '../abis/permissionless-creator.json' 
import { handleToProfileId } from "@/lens-protocol/functions/handleToProfileId";
import { authenticate, challenge } from "@/lens-protocol/functions/authentication";
import * as SecureStorage from "expo-secure-store"

export async function createProfileLensProtocol(requestedHandle : string) {
  try {
    const {data, error, loading} = await client.query({
      query: GenerateLensApiRelayAddressDocument
  });
  const relayAddress = data.generateLensAPIRelayAddress;
  console.log("lens relay address", relayAddress);
  //console.log("Just Cheking these arnt undefined", process.env.EXPO_PUBLIC_WALLET_PRIVATE_KEY, process.env.EXPO_PUBLIC_RPC_PROVIDER_URL);
  //change this once prod
  const CONTRACT_ADDRESS = '0x36440da1D98FF46637f0b98AAA082bc77977B49B';
  const MAINNET_CONTRACT_ADDRESS = "0x0b5e6100243f793e480DE6088dE6bA70aA9f3872"
  const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
  const wallet = new ethers.Wallet("50bf32df8314a397f68de47ae7a5e785abac36183965769250a77c643af1be93", provider);
  const permissonlessCreator = new ethers.Contract(
      CONTRACT_ADDRESS,
      abi,
      wallet
    ) 

  const price = await permissonlessCreator.getProfileWithHandleCreationPrice();

  console.log("the price", price);

  const tx = await permissonlessCreator.createProfileWithHandle(
      {
        to: "0x6C4b91558861C143919cA947fF93F2E38d2C328f",
        followModule: "0x0000000000000000000000000000000000000000",
        followModuleInitData: "0x",
      },
      requestedHandle, 
      [relayAddress],
      {
        value: price
      }
    );
    
    console.log(
      `Transaction to create a new profile with handle was successfully broadcasted with hash`,
      tx.hash
    );

    console.log('Transaction', tx);
    
    const receipt = await tx.wait();

    console.log(`Transaction was mined in block ${receipt.blockNumber}`);
    
    const profileId = await handleToProfileId(requestedHandle);
    console.log("profile id", profileId);

    const { id, text } = await challenge({signedBy: wallet.address, for: profileId});
    console.log("challenge text", text);

    const signature = await wallet.signMessage(text);
    console.log("Text Signed, Signature:", signature);

    const { accessToken, refreshToken, identityToken } = await authenticate({ id, signature });

    console.log("Authenticated", accessToken, refreshToken, identityToken);

    await SecureStorage.setItemAsync("access_token", accessToken);
    await SecureStorage.setItemAsync("refresh_token", accessToken);
    await SecureStorage.setItemAsync("identity_token", accessToken);

    return { accessToken, refreshToken, identityToken }
  } catch (error) {
    console.log(error);
  }

}