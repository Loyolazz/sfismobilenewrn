import Constants from "expo-constants";
import * as Application from "expo-application";

export function getAppVersion() {
    return (
        Constants.expoConfig?.version || // dev/preview
        Application.nativeApplicationVersion || // app instalado
        "0.0.0"
    );
}

export function getBuildNumber() {
    return Application.nativeBuildVersion ?? "";
}