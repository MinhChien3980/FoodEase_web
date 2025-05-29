"use client";
import {
  Box,
  Button,
  Divider,
  Link,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  useTheme,
} from "@mui/joy";
import React, { useState, useEffect, useCallback } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import FirebaseData from "@/@core/firebase";
import toast from "react-hot-toast";
import * as fbq from "@/lib/fpixel";
import { RiArrowLeftLine, RiTimer2Line } from "@remixicon/react";
import {
  resend_otp,
  sign_up,
  verify_otp,
  verify_user,
} from "@/interceptor/api";
import OtpInput from "otp-input-react";
import { login, logout, OnLoginWithoutNumber } from "@/events/actions";
import RegisterModal from "./RegisterModal";
import { useSelector } from "react-redux";
import { onLoggedIn } from "@/events/events";
import ProfileButton from "../Profile/ProfileButton";
import { useTranslation } from "react-i18next";
const LoginModel = () => {
  const [open, setOpen] = React.useState(false);
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE;
  const countryCode = process.env.NEXT_PUBLIC_COUNTRY_CODE;
  const firebase = FirebaseData();
  const { auth, googleProvider, facebookProvider } = FirebaseData();
  const isLogin = useSelector((state) => state.authentication.isLogged);
  const authentication_mode = useSelector(
    (state) => state.settings?.value?.authentication_mode
  );

  const { t } = useTranslation();

  const [state, setState] = useState({
    email: "",
    password: "",
    isLoading: false,
    error: "",
  });
  useEffect(() => {
    window.recaptchaVerifier = new firebase.firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
      }
    );
  }, [firebase.firebase.auth]);

  //Send OTP
  const handleSendOTP = useCallback(async () => {
    if (!state.phoneNumber) {
      toast.error(t("please-enter-your-number"));
      return;
    }

    setState((prevState) => ({
      ...prevState,
      sendOtp: true,
    }));

    try {
      if (authentication_mode == 0) {
        const confirmationResult = await firebase.auth.signInWithPhoneNumber(
          `+${state.phoneNumber}`,
          window.recaptchaVerifier
        );

        if (confirmationResult) {
          toast.success(t("otp-send-sucessfully"));
          fbq.customEvent("otp-send-firebase", { number: state.phoneNumber });
          window.confirmationResult = confirmationResult;
          setState((prevState) => ({
            ...prevState,
            sendOtp: false,
            isLoading: true,
            confirmationResult: confirmationResult,
          }));
        }
      } else {
        let mobile = state.phoneNumberWithoutCountry;

        const response = await verify_user({ mobile });
        if (response.error) {
          toast.error(response.message);
        } else {
          setState((prevState) => ({
            ...prevState,
            sendOtp: false,
            isLoading: true,
            confirmationResult: response,
          }));
          toast.success(t("otp-send-sucessfully"));
          fbq.customEvent("otp-Resend-custom", { number: state.phoneNumber });
        }
      }
    } catch (error) {
      window.recaptchaVerifier.render().then(function (widgetId) {
        window.recaptchaVerifier.reset(widgetId);
      });
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        sendOtp: false,
      }));
      toast.error(error.message);
    }
  }, [
    state.phoneNumber,
    firebase.auth,
    state.phoneNumberWithoutCountry,
    authentication_mode,
    t,
  ]);

  // ReSend OTP
  const handleResendOTP = useCallback(async () => {
    try {
      // Disable button and set initial resend time
      setState((prevState) => ({
        ...prevState,
        resendDisabled: true,
        resendTime: 20, // Set the timer to 20 seconds
      }));

      if (authentication_mode == 0) {
        const appVerifier = window.recaptchaVerifier;

        window.confirmationResult = null;

        const confirmationResult = await firebase.auth.signInWithPhoneNumber(
          `+${state.phoneNumber}`,
          appVerifier
        );

        window.confirmationResult = confirmationResult;
        toast.success(t("otp-send-sucessfully")); // Show success toast
        fbq.customEvent("otp-Resend-firebase", { number: state.phoneNumber });
      } else {
        let mobile = state.phoneNumberWithoutCountry;
        const response = await resend_otp(mobile);
        if (response.error) {
          toast.error(response.message);
        } else {
          toast.success(t("otp-send-sucessfully")); // Show success toast
          fbq.customEvent("otp-Resend-custom", { number: state.phoneNumber });
        }
      }

      // Start countdown for resend button
      const interval = setInterval(() => {
        setState((prevState) => {
          if (prevState.resendTime <= 1) {
            clearInterval(interval);
            return { ...prevState, resendDisabled: false, resendTime: 0 };
          }
          return { ...prevState, resendTime: prevState.resendTime - 1 };
        });
      }, 1000);
    } catch (error) {
      toast.error(error.message);
      setState((prevState) => ({ ...prevState, resendDisabled: false }));
    }
  }, [
    state.phoneNumber,
    firebase.auth,
    state.phoneNumberWithoutCountry,
    authentication_mode,
    t,
  ]);

  const theme = useTheme();
  //Verify User
  const verifyUser = useCallback(async () => {
    try {
      const number = state.phoneNumber.slice(2);
      const verify = await verify_user({ mobile: number });
      return verify;
    } catch (error) {
      console.error("Verify User Error:", error);
      return { error: true };
    }
  }, [state.phoneNumber]);
  //OTP Verification
  const handleOTPVerification = useCallback(async () => {
    if (!state.otp) {
      toast.error("Please Enter Verification Code");
      return;
    }

    setState((prevState) => ({ ...prevState, verifyOtp: true }));
    const number = state.phoneNumber.slice(2);

    try {
      if (authentication_mode == 0) {
        await window.confirmationResult.confirm(state.otp);
        const verify = await verifyUser();

        if (!verify.error) {
          const userLogin = await login({ phoneNumber: number });

          if (!userLogin.error) {
            setState({
              phoneNumber: demoMode == "true" ? "919876543210" : "",
              isLoading: false,
              isOTPLoading: false,
              OTPReset: false,
              otp: demoMode == "true" ? "123456" : "",
              resendDisabled: false,
              resendTime: 0,
              openRegisterModal: false,
              sendOtp: false,
              verifyOtp: false,
              confirmationResult: null,
            });
            // toast.success(userLogin?.message);
            toast.success(t("Logged-in-successfully"));
            setOpen(false);
            fbq.customEvent("otp-verified-firebase", {
              number: state.phoneNumber,
            });

            onLoggedIn();
            fbq.customEvent("user-login", {
              number: state.phoneNumber,
            });
          } else {
            setState((prevState) => ({
              ...prevState,
              openRegisterModal: true,
              verifyOtp: false,
              isLoading: false,
              isOTPLoading: false,
            }));
          }
        } else {
          toast.error(verify?.message);
        }
      } else {
        let phoneWithoutCountry = state.phoneNumberWithoutCountry;
        let verificationCode = state.otp;
        const response = await verify_otp({
          phoneWithoutCountry,
          verificationCode,
        });
        if (response.error) {
          toast.error(response.message);
        } else {
          const userLogin = await login({ phoneNumber: number });

          if (!userLogin.error) {
            setState({
              phoneNumber: demoMode == "true" ? "919876543210" : "",
              isLoading: false,
              isOTPLoading: false,
              OTPReset: false,
              otp: demoMode == "true" ? "123456" : "",
              resendDisabled: false,
              resendTime: 0,
              openRegisterModal: false,
              sendOtp: false,
              verifyOtp: false,
              confirmationResult: null,
            });
            toast.success(t("Logged-in-successfully"));
            setOpen(false);
            onLoggedIn();
            fbq.customEvent("otp-verified-custom", {
              number: state.phoneNumber,
            });
            fbq.customEvent("user-login", {
              number: state.phoneNumber,
            });
          } else {
            setState((prevState) => ({
              ...prevState,
              openRegisterModal: true,
              verifyOtp: false,
            }));
            toast.error(userLogin?.message);
          }
        }
      }
    } catch (err) {
      setState((prevState) => ({ ...prevState, verifyOtp: false }));
      toast.error(t("Failed-to-Verify-Otp"));
    }
  }, [
    state.otp,
    state.phoneNumber,
    verifyUser,
    demoMode,
    state.phoneNumberWithoutCountry,
    authentication_mode,
  ]);

  const handleSignInWithOutNumber = async (providerName) => {
    try {
      const provider =
        providerName === "google" ? googleProvider : facebookProvider;
      // Trigger sign-in flow
      const result = await auth.signInWithPopup(provider);
      const user = result.user;

      // Extract user details
      const userName = user.displayName;
      const email = user.email;
      const mobile = user.phoneNumber;
      const photoURL = user.photoURL;

      // Pass user data to your login function
      const res = await OnLoginWithoutNumber(
        providerName,
        userName,
        email,
        mobile,
        photoURL,
        setOpen
      );

      if (!res.error) {
        toast.success(t("Logged-in-successfully"));
        onLoggedIn();
        fbq.customEvent("user-login-google", {
          gmail: email,
          userName: userName,
        });
      }
    } catch (error) {
      console.error(`${providerName} Sign-In Error:`, error);
      alert(
        `Failed to sign in with ${
          providerName.charAt(0).toUpperCase() + providerName.slice(1)
        }. Please try again.`
      );
    }
  };

  return (
    <Box>
      <div id="sign-in-button"></div>
      {!isLogin ? (
        <Button onClick={() => setOpen(true)}>{t("login")}</Button>
      ) : (
        <>
          <ProfileButton />
        </>
      )}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <ModalDialog
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={open}
          onClose={() => setOpen(false)}
          size="lg"
          sx={{ minWidth: { xs: "90%", sm: "70%", md: 500 } }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography fontSize="xl" fontWeight="lg" mb={1}>
            {t("please-log-in-to-continue")}
          </Typography>
          <Box py={2} display="flex" flexDirection="column" gap={2}>
            <input
              type="email"
              placeholder={t("enter-email")}
              value={state.email}
              onChange={e => setState(s => ({ ...s, email: e.target.value }))}
              style={{ padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <input
              type="password"
              placeholder={t("enter-password")}
              value={state.password}
              onChange={e => setState(s => ({ ...s, password: e.target.value }))}
              style={{ padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #ccc' }}
            />
            {state.error && (
              <Typography color="danger" fontSize="sm">{state.error}</Typography>
            )}
            <Button
              variant="solid"
              color="primary"
              sx={{ width: "100%" }}
              onClick={async () => {
                setState(s => ({ ...s, isLoading: true, error: "" }));
                const res = await login({ email: state.email, password: state.password });
                if (res.error) {
                  setState(s => ({ ...s, isLoading: false, error: res.message }));
                } else {
                  toast.success(t("Logged-in-successfully"));
                  setOpen(false);
                  setState({ email: "", password: "", isLoading: false, error: "" });
                  onLoggedIn();
                }
              }}
              disabled={state.isLoading}
            >
              {state.isLoading ? t("loading") : t("login")}
            </Button>
            {/* Register Button */}
            <Button
              variant="plain"
              color="neutral"
              sx={{ width: "100%", mt: 1 }}
              onClick={() => setState(s => ({ ...s, openRegisterModal: true }))}
            >
              {t("register")}
            </Button>
            <Divider sx={{ my: 2 }}>{t("or")}</Divider>
            <Button
              variant="outlined"
              color="primary"
              sx={{ width: "100%" }}
              onClick={async () => {
                try {
                  const result = await firebase.auth.signInWithPopup(firebase.googleProvider);
                  const user = result.user;
                  const userName = user.displayName;
                  const email = user.email;
                  const mobile = user.phoneNumber;
                  const photoURL = user.photoURL;
                  const res = await OnLoginWithoutNumber(
                    "google",
                    userName,
                    email,
                    mobile,
                    photoURL,
                    setOpen
                  );
                  if (!res?.error) {
                    toast.success(t("Logged-in-successfully"));
                    onLoggedIn();
                  }
                } catch (error) {
                  toast.error(t("Google sign-in failed"));
                }
              }}
              startDecorator={<Box component="img" src="/assets/images/google-logo.svg" alt="Google Logo" width={24} height={24} />}
            >
              {t("continue-with-google")}
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      {state.openRegisterModal && (
        <RegisterModal
          openRegisterModal={state.openRegisterModal}
          setLoginModalOpen={setOpen}
          setOpenRegisterModal={(value) =>
            setState((prevState) => ({
              ...prevState,
              openRegisterModal: value,
            }))
          }
          mobile={state.phoneNumber}
        />
      )}
    </Box>
  );
};

export default LoginModel;
