import { Alert } from "react-native";

export const AlertConfirm = (title, message, onPress, labelButton = 'Ok') => {
    return Alert.alert(
    title,
    message,
    [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: "Cancel",
      },
      // The "Yes" button
      {
        text: labelButton,
        onPress: onPress
      },
    ]
  );
}

export default AlertConfirm;