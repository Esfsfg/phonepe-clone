// import React from 'react';
// import { Image, TouchableOpacity } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import HomeScreen from './src/HomeScreen';
// import SearchScreen from './src/SearchScreen';
// import AlertsScreen from './src/AlertsScreen';
// import HistoryScreen from './src/HistoryScreen';
// import ScanScreen from './src/ScanScreen';

// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//      <Tab.Navigator
//   screenOptions={{
//     headerShown: false,
//     tabBarShowLabel: true,
//     tabBarStyle: { height: 70 },

//     tabBarActiveTintColor: '#000',     // active = black
//     tabBarInactiveTintColor: '#888',   // inactive = gray

//     tabBarLabelStyle: {
//       fontSize: 12,
//       fontWeight: '600',               // semi-bold
//     },
//   }}
// >

//         <Tab.Screen
//           name="Home"
//           component={HomeScreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <Image
//                 source={
//                   focused
//                     ? require('./src/asset/home_Active.png')
//                     : require('./src/asset/home.png')
//                 }
//                 style={{ width: 30, height: 30 }}
//               />
//             ),
//           }}
//         />

//         <Tab.Screen
//           name="Search"
//           component={SearchScreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <Image
//                 source={
//                   focused
//                     ? require('./src/asset/search_Active.png')
//                     : require('./src/asset/search.png')
//                 }
//                 style={{ width: 30, height: 30 }}
//               />
//             ),
//           }}
//         />

//         {/* CENTER BUTTON */}
//         <Tab.Screen
//           name="Scan"
//           component={ScanScreen}
//           options={{
//             tabBarLabel: '',
//             tabBarButton: (props) => (
//               <TouchableOpacity
//                 {...props}
//                 style={{
//                   top: -20,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}
//               >
//                 <Image
//                   source={require('./src/asset/scan.png')}
//                   style={{ width: 65, height: 65 }}
//                 />
//               </TouchableOpacity>
//             ),
//           }}
//         />

//         <Tab.Screen
//           name="Alerts"
//           component={AlertsScreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <Image
//                 source={
//                   focused
//                     ? require('./src/asset/alert_Active.png')
//                     : require('./src/asset/alert.png')
//                 }
//                 style={{ width: 30, height: 30 }}
//               />
//             ),
//           }}
//         />

//         <Tab.Screen
//           name="History"
//           component={HistoryScreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <Image
//                 source={
//                   focused
//                     ? require('./src/asset/history_Active.png')
//                     : require('./src/asset/history.png')
//                 }
//                 style={{ width: 30, height: 30 }}
//               />
//             ),
//           }}
//         />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// } 

import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,              // ✅ ADD THIS
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native'

import {
  Camera,
  useCameraDevice,
  useCodeScanner
} from 'react-native-vision-camera'


const { width, height } = Dimensions.get('window')
const SCAN_SIZE = width * 0.65
const BOX_TOP = height * 0.3

export default function ScanScreen() {
  const device = useCameraDevice('back')
  const [permission, setPermission] = useState('pending')

const [torch, setTorch] = useState(false)
  const scanLine = useRef(new Animated.Value(0)).current
  const cornerScale = useRef(new Animated.Value(1)).current

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      console.log('SCANNED:', codes[0]?.value)
    }
  })

  useEffect(() => {
    Camera.requestCameraPermission().then(setPermission)

    // Scan line animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: SCAN_SIZE,
          duration: 1800,
          useNativeDriver: true
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true
        })
      ])
    ).start()

    // Corner pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(cornerScale, {
          toValue: 1.15,
          duration: 900,
          useNativeDriver: true
        }),
        Animated.timing(cornerScale, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true
        })
      ])
    ).start()
  }, [])

  if (permission !== 'granted') return null
  if (!device) return null

  return (
    <View style={styles.container}>
    <Camera
  style={StyleSheet.absoluteFill}
  device={device}
  isActive
  torch={torch ? 'on' : 'off'}
  codeScanner={codeScanner}
/>

      {/* Dark overlays */}
      <View style={[styles.overlay, { height: BOX_TOP }]} />
      <View
        style={[
          styles.overlay,
          {
            top: BOX_TOP + SCAN_SIZE,
            height: height - (BOX_TOP + SCAN_SIZE)
          }
        ]}
      />
      <View
        style={[
          styles.overlay,
          {
            top: BOX_TOP,
            height: SCAN_SIZE,
            width: (width - SCAN_SIZE) / 2
          }
        ]}
      />
      <View
        style={[
          styles.overlay,
          {
            top: BOX_TOP,
            height: SCAN_SIZE,
            right: 0,
            width: (width - SCAN_SIZE) / 2
          }
        ]}
      />

      {/* Scan box */}
      <View style={styles.scanBox}>
        <Animated.View
          style={[
            styles.scanLine,
            { transform: [{ translateY: scanLine }] }
          ]}
        />

        {/* Corners */}
        {['tl', 'tr', 'bl', 'br'].map(pos => (
          <Animated.View
            key={pos}
            style={[
              styles.corner,
              styles[pos],
              { transform: [{ scale: cornerScale }] }
            ]}
          />
        ))}
      </View>
<View style={styles.bottomActions}>
  {/* Gallery */}
  <View style={styles.actionItem}>
    <TouchableOpacity style={styles.circleBtn}>
      <Image
        source={require('./src/asset/uploadqr.png')}
        style={styles.icon}
      />
    </TouchableOpacity>
    <Text style={styles.actionText}>Upload QR</Text>
  </View>

  {/* Torch */}
  <View style={styles.actionItem}>
    <TouchableOpacity
      style={styles.circleBtn}
      onPress={() => setTorch(prev => !prev)}
    >
      <Image
        source={
          torch
            ? require('./src/asset/torch_on.png')
            : require('./src/asset/torch_off.png')
        }
        style={styles.icon}
      />
    </TouchableOpacity>
    <Text style={styles.actionText}>Torch</Text>
  </View>
</View>


      {/* Bottom image */}
      <Image
        source={require('./src/asset/bhim.png')}
        style={styles.bottomImage}
        resizeMode="contain"
      />
    </View>
  )
}

const CORNER_SIZE = 26
const CORNER_THICKNESS = 3
const COLOR = '#7F3DFF'

const styles = StyleSheet.create({
bottomActions: {
  position: 'absolute',
  top: BOX_TOP + SCAN_SIZE + 30,
  alignSelf: 'center',
  flexDirection: 'row',
  gap: 40
},

circleBtn: {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: 'white',
  justifyContent: 'center',
  alignItems: 'center'
},

icon: {
  width: 65,
  height: 65,
  
}
,


  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  scanBox: {
    position: 'absolute',
    top: BOX_TOP,
    alignSelf: 'center',
    width: SCAN_SIZE,
    height: SCAN_SIZE
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: COLOR
  },

  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: COLOR
  },

  tl: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS
  },
  tr: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS
  },
  bl: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS
  },
  br: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS
  },

  bottomImage: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    width: 200,
    height: 60
  }
})
