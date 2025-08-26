import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { getVersion as fetchVersion } from "../api/getVersion";

//DES
 const APK_HOST = "http://10.61.0.40";
 const APK_PATH = "/Sistemas/SFISMobile/apk";
 const APK_NAME = "SFISMobile";

//MAQUINA CRISPIMM
// const APK_HOST = "http://10.212.134.8";
// const APK_PATH = "/Sistemas/SFISMobile/apk";
// const APK_NAME = "SFISMobile";

//HMG
// const APK_HOST = "https://sistemasinternet3hmg.antaq.gov.br";
// const APK_PATH = "/Sistemas/SFISMobile/apk-trainee";
// const APK_NAME = "SFISMobile";

//PRD
// const APK_HOST = "https://web3.antaq.gov.br";
// const APK_PATH = "/Sistemas/SFISMobile";
// const APK_NAME = "SFISMobile";

export function getAppVersion() {
  return (
    Constants.expoConfig?.version ??
    Constants.manifest?.version ??
    "0.0.0"
  );
}

export function getBuildNumber() {
  return Constants.expoConfig?.extra?.buildNumber ?? "";
}

export async function ensureLatestVersion() {
  const current = getAppVersion();
  const latest = await fetchVersion();

  // Exibe a versão atual do app e a versão disponível na API
  console.log("Versão atual do app:", current);
  console.log("Versão disponibilizada pela API:", latest);

  if (latest && latest !== current) {
    const url = `${APK_HOST}${APK_PATH}/${APK_NAME}-${latest}.apk`;
    await Linking.openURL(url);
    return false;
  }
  return true;
}
