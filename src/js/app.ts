import {
  LoginIdConfiguration,
  LoginIdCredentials,
  LoginIdPasskey,
  LoginIdEmail,
  LoginIdError,
} from "@loginid/web-sdk";
import * as Service from "./service";

const loginForm = document.getElementById("login") as HTMLFormElement;
const addPasskeyForm = document.getElementById(
  "add-passkey"
) as HTMLFormElement;

const header = document.querySelector(".title") as HTMLHeadingElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;
const emailMessage = document.querySelector(".email-message") as HTMLDivElement;
const errorMessage = document.querySelector(".error-message") as HTMLDivElement;
const skipButton = document.getElementById("skip-button") as HTMLButtonElement;
const loginButton = document.getElementById(
  "login-button"
) as HTMLButtonElement;
const addPasskeyButton = document.getElementById(
  "add-passkey-button"
) as HTMLButtonElement;

const appId = process.env.LOGINID_APP_ID || "";
const baseUrl = process.env.LOGINID_BASE_URL || "";

if (!appId || !baseUrl) {
  alert("Please provide LOGINID_APP_ID and LOGINID_BASE_URL");
}

//initialize the sdk
const loginIdConfiguration = new LoginIdConfiguration(baseUrl, appId);
const loginIdPasskey = new LoginIdPasskey(loginIdConfiguration);
const loginIdEmail = new LoginIdEmail(loginIdConfiguration);
const loginIdCredentials = new LoginIdCredentials(loginIdConfiguration);

let username = "";
let token = "";

const addPasskeyView = () => {
  //change state to add passkey
  header.remove();
  emailMessage.remove();
  loginForm.remove();
  addPasskeyForm.style.display = "block";
};

loginButton?.addEventListener("click", async (e) => {
  e.preventDefault();
  emailMessage.style.display = "none";
  errorMessage.style.display = "none";

  username = usernameInput.value;

  //attempt to signin with passkeys
  try {
    try {
      const { auth_data } = await loginIdPasskey.signinWithPasskey(username);
      await Service.login(username, auth_data.token);

      return;
    } catch (e) {
      if (e instanceof LoginIdError) {
        //user does not exists with LoginID
        //sign up with email verification
        //offer to add passkey
        if (
          e.getErrorCategory() === "not_found" &&
          e.getErrorCode() === "unknown_user"
        ) {
          loginButton.remove();
          emailMessage.style.display = "block";

          const { auth_data } = await loginIdEmail.signupWithEmail(username);
          token = auth_data.token;

          //change state to add passkey
          addPasskeyView();
          return;
        }

        //user exists with LoginID but does not have passkeys
        //sign in with email verification
        //offer to add passkey
        if (
          e.getErrorCategory() === "not_found" &&
          e.getErrorCode() === "no_authenticators_found"
        ) {
          loginButton.remove();
          emailMessage.style.display = "block";

          const { auth_data } = await loginIdEmail.signinWithEmail(username);
          token = auth_data.token;

          //change state to add passkey
          addPasskeyView();
          return;
        }
      }

      console.log(e);

      //default to email verification
      //this will be a catch all for all other errors
      //we can handle specific errors if we want to but not for this sample
      //for example, user lock out, user cancelled, no passkeys, etc.
      loginButton.remove();
      emailMessage.style.display = "block";

      const { auth_data } = await loginIdEmail.signinWithEmail(username);
      token = auth_data.token;
      await Service.login(username, token);

      return;
    }
  } catch (e) {
    if (e instanceof Error) {
      errorMessage.style.display = "block";
      errorMessage.innerHTML = e.message;
    }
  }
});

addPasskeyButton?.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    await loginIdCredentials.addPasskeyWithToken(username, token);
    //send token to server to be verified
    await Service.login(username, token);
  } catch (e) {
    if (e instanceof Error) {
      errorMessage.style.display = "block";
      errorMessage.innerHTML = e.message;
    }
  }
});

skipButton?.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    //send token to server to be verified
    await Service.login(username, token);
  } catch (e) {
    if (e instanceof Error) {
      errorMessage.style.display = "block";
      errorMessage.innerHTML = e.message;
    }
  }
});
