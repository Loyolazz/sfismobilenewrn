import "react-native";
declare module "react-native" {
    interface ViewProps { className?: string }
    interface TextProps { className?: string }
    interface PressableProps { className?: string }
    interface TextInputProps { className?: string }
    interface ImageProps { className?: string }
    interface ImageBackgroundProps { className?: string }
    interface KeyboardAvoidingViewProps { className?: string }
}