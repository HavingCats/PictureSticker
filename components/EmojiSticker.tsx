import { ImageSourcePropType } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = {
  imageSize: number;
  stickerSource: ImageSourcePropType;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  const scaleImage = useSharedValue(imageSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const doubleTap = Gesture.Tap()           // 创建点击手势
  .numberOfTaps(2)                        // 设置为双击（2次点击）
  .onStart(() => {                         // 手势开始时执行
    if (scaleImage.value !== imageSize * 2) {
      scaleImage.value = scaleImage.value * 2;  // 放大2倍
    } else {
      scaleImage.value = Math.round(scaleImage.value / 2);  // 缩小回原大小
    }
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });
   
  const drag = Gesture.Pan()                 // 创建拖拽手势
  .onChange(event => {                     // 拖拽过程中持续触发
    translateX.value += event.changeX;      // 累加 X 方向的变化量
    translateY.value += event.changeY;     // 累加 Y 方向的变化量
  });
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });
  

  return (
    <GestureDetector gesture={drag}>
    <Animated.View style={[containerStyle, { top: -350 }]}>
      <GestureDetector gesture={doubleTap}>
        <Animated.Image
          source={stickerSource}
          resizeMode="contain"
          style={[imageStyle, { width: imageSize, height: imageSize }]}
        />
      </GestureDetector>
    </Animated.View>
  </GestureDetector>
  );
}
