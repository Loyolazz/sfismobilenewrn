import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { getVersion as fetchVersion } from "../api/getVersion";

const APK_HOST = "http://10.61.0.40";
const APK_PATH = "/Sistemas/SFISMobile/apk";
const APK_NAME = "SFISMobile";

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
