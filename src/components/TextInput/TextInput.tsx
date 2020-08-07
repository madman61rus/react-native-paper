import * as React from 'react';
import {normalize} from '../../utils';
import {Break, Row} from '../../bonds';
import styled from 'styled-components/native';
import {Animated, Platform, TextInput as InputTx} from 'react-native';

type Props = {
  borderColor?: string;
  editable?: boolean;
  isRequired: boolean;
  onPress?: () => void;
  onChangeText: (value: string) => void;
  title?: string;
  maxLength?: number;
  multiline: boolean;
  value: string;
  width?: number;
};

const titleBottom = -normalize(20);
const titleTop = normalize(1);

export const TextInput = (props: Props) => {
  const {
    borderColor = '#C4C4C4',
    editable = true,
    isRequired,
    onPress = () => null,
    onChangeText,
    title = '',
    value = '',
    maxLength = 180,
    multiline = false,
    width = normalize(0),
  } = props;

  let inputRef = React.useRef<InputTx>(null).current;
  const [inputHeight, setInputHeight] = React.useState(45);
  const [isFocus, setFocus] = React.useState(value.length > 0);
  const titlePosition = React.useRef(
    new Animated.Value(value.length > 0 ? titleTop : titleBottom),
  ).current;

  const handlePress = () => {
    if (!editable && onPress) {
      onPress();
      return;
    }

    console.log('isFocus', isFocus, 'title', title)

    Animated.timing(titlePosition, {
      toValue: isFocus && value.length === 0 ? titleBottom : titleTop,
      duration: 300,
    }).start(() => {
      setFocus(!isFocus);

      if (!editable) {
        onPress();
      }
    });


  };


  const onBlur = () => {
    //setFocus(false);
    //inputRef?.blur();
    //handlePress();
  }

  React.useEffect(() => {
    if (isFocus){
      inputRef?.focus();
    }

  }, [isFocus])



  let fontSize = titlePosition.interpolate({
    inputRange: [titleBottom, titleTop],
    outputRange: [normalize(14), normalize(12)],
  });

  const RequiredTitle = (fontSize: Animated.AnimatedInterpolation) => {
    return (
      <Row justifyContent="flex-start">
        <Title as={Animated.Text} style={{fontSize}}>
          {title}
        </Title>
        <Break marginRight={3} />
        <Title as={Animated.Text} style={{fontSize, color: 'red'}}>
          •
        </Title>
      </Row>
    );
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      height={multiline ? normalize(inputHeight) : normalize(45)}
      width={width}
      borderColor={borderColor}>
      {title && (
        <TitleContainer as={Animated.View} style={{bottom: titlePosition}}>
          {isRequired ? (
            RequiredTitle(fontSize)
          ) : (
            <TextTouchable onPress={handlePress}>
              <Title as={Animated.Text} style={{fontSize}}>
                {title}
              </Title>
            </TextTouchable>
          )}
        </TitleContainer>
      )}
      {(isFocus) && (
        <Input
          ref={ref => {
            if (ref) {
              inputRef = ref;
            }
          }}
          value={value}
          pointerEvents="none"
          onChangeText={onChangeText}
          onBlur={onBlur}
          editable={editable}
          multiline={multiline}
          height={inputHeight}
          maxLength={maxLength}
          onContentSizeChange={({
            nativeEvent: {
              contentSize: {width, height},
            },
          }) => {
            if (isFocus && multiline && inputHeight !== height) {
              setInputHeight(height + 25);
            }
          }}
        />
      )}
    </TouchableOpacity>
  );
};

const TextTouchable = styled.TouchableOpacity``;

type TouchableOpacityType = {
  borderColor: string;
  height: number;
  width: number;
};

const TouchableOpacity = styled.TouchableOpacity<TouchableOpacityType>`
  background-color: transparent;
  border-bottom-width: ${normalize(0.6)};
  border-color: ${({borderColor}) => borderColor};
  height: ${({height}) => normalize(height)};
  width: ${({width}) => normalize(width)};
`;


const TitleContainer = styled.View``;

const Title = styled.Text`
  color: #202020;
  font-family: 'Ubuntu';
`;

type InpuType = {
  height: number;
};

const Input = styled.TextInput<InpuType>`
  color: #202020;
  font-family: 'Ubuntu';
  font-size ${normalize(16)};
  height: ${({height}) => normalize(height)};
  padding-bottom: ${normalize(Platform.OS === 'android' ? 10 : 1)};
`;


