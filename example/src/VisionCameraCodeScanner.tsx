import React, { useRef, useState, type FunctionComponent } from 'react';
import {
  Alert,
  AlertButton,
  Button,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

export type VisionCameraCodeScannerProps = {};

export const VisionCameraCodeScanner: FunctionComponent<
  VisionCameraCodeScannerProps
> = () => {
  const { hasPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [barcodes, setBarcodes] = useState<Code[]>([]);

  const isShowingAlert = useRef(false);
  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13'],
    onCodeScanned: codes => {
      console.log(`Scanned ${codes.length} codes:`, codes);
      const value = codes[0]?.value;
      if (value == null) {
        return;
      }
      setBarcodes(codes);
      if (isShowingAlert.current) {
        return;
      }
      showCodeAlert(value, () => {
        isShowingAlert.current = false;
      });
      isShowingAlert.current = true;
    },
  });

  if (!hasPermission) {
    return <CameraPermissionPrompt />;
  }

  if (device == null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
        enableZoomGesture={true}
      />
      {barcodes.length > 0 ? (
        <View style={styles.barcodesContainer}>
          {barcodes.map(barcode => (
            <Text key={barcode.value} style={styles.barcodeText}>
              {barcode ? barcode.value : null} ({barcode.type})
            </Text>
          ))}
        </View>
      ) : null}
      <Button title="Reset" onPress={() => setBarcodes([])} />
    </View>
  );
};

const CameraPermissionPrompt: FunctionComponent = () => {
  const { requestPermission } = useCameraPermission();
  return (
    <View style={styles.container}>
      <Text style={styles.permissionText}>
        Vision Camera needs <Text style={styles.bold}>Camera permission</Text>.
        <Text style={styles.hyperlink} onPress={requestPermission}>
          Grant
        </Text>
      </Text>
    </View>
  );
};

const showCodeAlert = (value: string, onDismissed: () => void): void => {
  const buttons: AlertButton[] = [
    {
      text: 'Close',
      style: 'cancel',
      onPress: onDismissed,
    },
  ];
  if (value.startsWith('http')) {
    buttons.push({
      text: 'Open URL',
      onPress: () => {
        Linking.openURL(value);
        onDismissed();
      },
    });
  }
  Alert.alert('Scanned Code', value, buttons);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  barcodesContainer: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: '#00000080',
    padding: 16,
    borderRadius: 8,
  },
  barcodeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  permissionsContainer: {
    marginTop: 32,
  },
  permissionText: {
    fontSize: 17,
  },
  hyperlink: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
});
