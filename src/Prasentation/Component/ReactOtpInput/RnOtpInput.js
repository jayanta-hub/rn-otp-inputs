import {
  View,
  TextInput,
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import {
  guidelineBaseWidth,
  scale,
} from "../../../Infrastructure/utils/screenUtility";
import PropTypes from "prop-types";
const RnOtpInputs = (props) => {
  const {
    onSubmit,
    secureTextEntry,
    autoSubmit,
    mode,
    borderRadius,
    onChageValue,
    bgcolor,
    textColor,
    borderWidth,
    borderColor,
    keyboardType,
    buttonTitle,
    Minute,
    Second,
    buttonStyle,
    onlyResendOtp,
    onResentClick,
    buttonTitleStyle,
    resendTextStyle,
  } = props;
  const inputRef = useRef();
  const [otp, setOtp] = useState(
    new Array(
      props.pinCount && props.pinCount <= 6 && props.pinCount >= 3
        ? props.pinCount
        : 4,
    ).fill(""),
  );
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [minute, setMinute] = useState(Minute);
  const [second, setSecond] = useState(Second);
  const [isResend, setIsResend] = useState(false);
  const ChangeHandler = (e, index) => {
    const { text } = e.nativeEvent;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    e.nativeEvent?.text
      ? setActiveOtpIndex(index + 1)
      : activeOtpIndex !== 0
      ? setActiveOtpIndex(index - 1)
      : null;

    /**
     * ? For AutoSubmit (After Fill All Input we Can call a Fun)
     */

    onChageValue(newOtp.join("").toString());
    autoSubmit
      ? activeOtpIndex === props.pinCount - 1
        ? onSubmit(newOtp.join("").toString())
        : null
      : null;
  };
  const OnKeyHandler = (e, index) => {
    /**
     * ? When Enter BackSpace
     */
    e.nativeEvent.key === "Backspace" ? setActiveOtpIndex(index - 1) : null;
  };

  /**
   * ? For Dynamic Array
   */

  useEffect(() => {
    setOtp(
      new Array(
        props.pinCount && props.pinCount <= 6 && props.pinCount >= 3
          ? props.pinCount
          : 4,
      ).fill(""),
    );
  }, [props.pinCount]);

  /**
   * ? For Focus on each box
   */

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  /**
   * ? For Timer
   */

  useEffect(() => {
    isResend ? (setSecond(Second), setMinute(Minute)) : null;
    const interval = setInterval(() => {
      if (second > 0) {
        setSecond(second - 1);
        setIsResend(false);
      }
      if (second === 0) {
        if (minute === 0) {
          clearInterval(interval);
          setIsResend(false);
        } else {
          setSecond(59);
          setMinute(minute - 1);
          setIsResend(false);
        }
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [second, isResend]);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerWrap}>
          {otp.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  borderBottomWidth:
                    mode === "flat"
                      ? 1
                      : activeOtpIndex === index
                      ? borderWidth
                      : 0,
                  borderWidth: scale(
                    mode === "flat"
                      ? 0
                      : activeOtpIndex === index
                      ? borderWidth
                      : 0,
                  ),
                  borderRadius: scale(
                    mode === "circle"
                      ? 50
                      : mode === "flat"
                      ? 0
                      : mode === "rectangle"
                      ? borderRadius
                      : borderRadius,
                  ),
                  backgroundColor: mode === "flat" ? "#FFFFFF" : bgcolor,
                  marginHorizontal:
                    Platform.isPad || guidelineBaseWidth > 500
                      ? scale(40)
                      : scale(0),
                  marginTop:
                    Platform.isPad || guidelineBaseWidth > 500
                      ? scale(20)
                      : scale(0),

                  padding: scale(0.5),
                  borderColor: borderColor,
                }}
              >
                <TextInput
                  key={index}
                  ref={index === activeOtpIndex ? inputRef : null}
                  autoCorrect={false}
                  value={otp[index]}
                  maxLength={1}
                  keyboardType={keyboardType}
                  editable={true}
                  onChange={(e) => ChangeHandler(e, index)}
                  onKeyPress={(e) => OnKeyHandler(e, index)}
                  secureTextEntry={secureTextEntry}
                  style={{
                    height: scale(
                      props.pinCount === 4 && props.pinCount < 7
                        ? 60
                        : props.pinCount === 5 && props.pinCount < 7
                        ? 55
                        : props.pinCount === 6 && props.pinCount < 7
                        ? 45
                        : 60,
                    ),
                    width: scale(
                      props.pinCount === 4 && props.pinCount < 7
                        ? 60
                        : props.pinCount === 5 && props.pinCount < 7
                        ? 55
                        : props.pinCount === 6 && props.pinCount < 7
                        ? 45
                        : 60,
                    ),
                    textAlign: "center",
                    fontSize: scale(22),
                    fontWeight: "500",
                    color: textColor,
                    borderRadius: scale(
                      mode === "circle"
                        ? 50
                        : mode === "flat"
                        ? 0
                        : mode === "rectangle"
                        ? borderRadius
                        : borderRadius,
                    ),
                    backgroundColor: mode === "flat" ? "#FFFFFF" : bgcolor,
                    paddingBottom: 0,
                    paddingTop: 0,
                  }}
                />
              </View>
            );
          })}
        </View>
        <View
          style={{
            ...styles.containerWrap,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setIsResend(true), onResentClick();
            }}
            disabled={
              onlyResendOtp
                ? false
                : minute === 0 && second === 0
                ? false
                : true
            }
            style={{
              opacity: onlyResendOtp
                ? 1
                : minute === 0 && second === 0
                ? 1
                : 0.5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={resendTextStyle}>
              Resend OPT
              {minute === 0 && second === 0 ? null : onlyResendOtp ? null : (
                <Text style={resendTextStyle}>
                  {" "}
                  in{" "}
                  {minute !== 0 ? `${minute}:${second} sec` : ` ${second} sec`}
                </Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: scale(10),
            marginHorizontal: scale(30),
          }}
        >
          <TouchableOpacity
            onPress={onSubmit}
            disabled={activeOtpIndex === props.pinCount ? false : true}
            style={{
              ...buttonStyle,
              opacity: activeOtpIndex === props.pinCount ? 1 : 0.5,
            }}
          >
            <Text style={buttonTitleStyle}>{buttonTitle}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

RnOtpInputs.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  pinCount: PropTypes.number.isRequired,
  secureTextEntry: PropTypes.bool,
  autoSubmit: PropTypes.bool,
  mode: PropTypes.string,
  onChageValue: PropTypes.func,
  bgcolor: PropTypes.string,
  textColor: PropTypes.string,
  borderColor: PropTypes.string,
  keyboardType: PropTypes.string,
  borderWidth: PropTypes.number,
  buttonTitle: PropTypes.string,
  Minute: PropTypes.number,
  Second: PropTypes.number,
  borderRadius: PropTypes.number,
  buttonStyle: PropTypes.object,
  onlyResendOtp: PropTypes.bool,
  onResentClick: PropTypes.func,
  buttonTitleStyle: PropTypes.object,
  resendTextStyle: PropTypes.object,
};

RnOtpInputs.defaultProps = {
  /**
   * ? not required, this prop mentioned as required in propTypes
   */
  // pinCount: 0,
  secureTextEntry: false,
  autoSubmit: false,
  mode: "rectangle",
  bgcolor: "#D9E3F6",
  textColor: "#000000",
  borderWidth: 1,
  borderColor: "#A768F1",
  keyboardType: "number-pad",
  buttonTitle: "Verify & Proceed",
  Minute: 1,
  Second: 0,
  onChageValue: () => {},
  onSubmit: (e) => {
    console.log("Enter Value :-", e);
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: "#349beb",
    height: scale(40),
    fontSize: scale(8),
    borderColor: "",
    borderRadius: scale(6),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: scale(10),
    marginBottom: scale(0),
    marginLeft: scale(0),
    marginHorizontal: scale(0),
    marginVertical: scale(0),
  },
  onlyResendOtp: false,
  onResentClick: () => {},
  buttonTitleStyle: {
    fontSize: scale(15),
    color: "#FFFFFF",
  },
  resendTextStyle: {
    fontSize: scale(15),
    color: "#404B69",
  },
};
export default RnOtpInputs;

const styles = StyleSheet.create({
  container: {
    marginVertical: scale(10),
  },
  containerWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scale(10),
    marginHorizontal: scale(30),
    flexWrap: "wrap",
  },
});
