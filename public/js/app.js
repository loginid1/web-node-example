'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var L="0.4.3";var u=class extends Error{_errorCategory;_errorCode;_errorMessage;constructor(e,t,s){super(`[${e}:${t}] - ${s}`),this.name="LoginSDK-Error",this._errorCategory=e,this._errorCode=t,this._errorMessage=s;}getErrorCategory(){return this._errorCategory}getErrorCode(){return this._errorCode}getErrorMessage(){return this._errorMessage}};var h=class{_baseUrl;_defaultHeaders;constructor(e){this._baseUrl=e,this._defaultHeaders=[["Content-Type","application/json"],["Accept","application/json"],["X-SDK-Version",L]];}async post(e,t,s){return this.sendRequest("POST",e,t,s)}async put(e,t,s){return this.sendRequest("PUT",e,t,s)}async delete(e,t){return this.sendRequest("DELETE",e,void 0,t)}async ws(e,t){let s=0,i=3;t!==void 0&&(i=t);let r=()=>{let a=this._baseUrl.replace(/^http:\/\//i,"ws://");return a=a.replace(/^https:\/\//i,"wss://"),a=a+e,new WebSocket(a)};return new Promise((a,o)=>{let d=()=>{let l=r(),I=()=>{console.log("WebSocket connection opened"),s=0;},R=C=>{let z=JSON.parse(C.data);a(z),l.close();},$=()=>{console.log("WebSocket connection closed"),s<i?(console.log(`Retrying (${s+1}/${i})...`),s++,d()):o(new Error("WebSocket connection closed without receiving messages"));},V=C=>{console.error("WebSocket error:",C),o(C);};l.addEventListener("open",I),l.addEventListener("message",R),l.addEventListener("close",$),l.addEventListener("error",V);};d();})}async sendRequest(e,t,s,i){let r=i?[...i,...this._defaultHeaders]:this._defaultHeaders,a=await fetch(this._baseUrl+t,{headers:r,method:e,body:s});if(a.status===204)return null;let o=await a.json();if(a.ok)return o;let{error_category:d,error_code:l,error_message:I}=o;throw new u(d,l,I)}};var X=n=>n.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""),G=n=>{if(!n)return n;let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",t=[],s=0;for(;s<n.length;){let a=n.charCodeAt(s++),o=n.charCodeAt(s++),d=n.charCodeAt(s++),l=a<<16|o<<8|d;t.push(e[l>>18&63]+e[l>>12&63]+e[l>>6&63]+e[l&63]);}let i=t.join(""),r=n.length%3;return r?i.slice(0,r-3)+"===".slice(r||3):i},Q=n=>{let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",t={},s=String.fromCharCode;for(let o=0;o<64;o++)t[e.charAt(o)]=o;let i=0,r=0,a="";for(let o of n){let d=t[o];if(d!==void 0)for(i=(i<<6)+d,r+=6;r>=8;)a+=s(i>>(r-=8)&255);}return a},c=n=>{let e="",t=new Uint8Array(n);for(let i=0;i<t.byteLength;i++)e+=String.fromCharCode(t[i]);let s=G(e);return X(s)},m=n=>{n=n.replace(/-/g,"+").replace(/_/g,"/");let e=Q(n),t=new Uint8Array(e.length);for(let s=0;s<e.length;s++)t[s]=e.charCodeAt(s);return t.buffer};var y=async n=>{let e;if(n.excludeCredentials!==void 0){e=[];for(let i of n.excludeCredentials){let r={id:m(i.id),transports:i.transports,type:i.type};e.push(r);}}let t={publicKey:{attestation:n.attestation,authenticatorSelection:{...n.authenticatorSelection},challenge:m(n.challenge),excludeCredentials:e,extensions:n.extensions,pubKeyCredParams:n.pubKeyCredParams,rp:n.rp,timeout:n.timeout,user:{...n.user,id:m(n.user.id)}}},s=await navigator.credentials.create(t);if(s===null)throw new u("creation_failed","credential_creation_error","Failed to create the passkey credential.");if(s.type!=="public-key")throw new u("invalid_type","invalid_credential_type","The created credential has an invalid type.");return s},_=async n=>{let e;if(n.allowCredentials!==void 0){e=[];for(let i of n.allowCredentials){let r={id:m(i.id),transports:i.transports,type:i.type};e.push(r);}}let t={publicKey:{allowCredentials:e,challenge:m(n.challenge),extensions:n.extensions,rpId:n.rpId,timeout:n.timeout,userVerification:n.userVerification}},s=await navigator.credentials.get(t);if(s===null)throw new u("request_failed","credential_request_error","Failed to create the passkey credential.");if(s.type!=="public-key")throw new u("invalid_type","invalid_credential_type","The requested credential has an invalid type.");return s};var p=async(n,e,t)=>{let s="/frontend-api/sessions/mfa/begin",i=JSON.stringify({app_id:n.getAppId(),mfa_id:e,username:t}),r=await n.getHttpClient().post(s,i);if(r)return r;throw new Error("MFA begin response null")},g=async(n,e)=>{let t="/frontend-api/sessions/mfa/complete",s=JSON.stringify({session_id:e}),i=await n.getHttpClient().post(t,s);if(i)return i;throw new Error("MFA complete response null")};var P=async(n,e,t)=>{let s="/frontend-api/sessions/mfa/authenticate/fido2/init",i=JSON.stringify({session_id:e,...t&&{username:t}});return await n.getHttpClient().post(s,i)},k=async(n,e,t,s,i)=>{let r=i.response,a="/frontend-api/sessions/mfa/authenticate/fido2/complete",o=JSON.stringify({session_id:e,...t&&{username:t},assertion_response:{id:c(i.rawId),challenge:s.challenge,type:"public-key",response:{authenticatorData:c(r.authenticatorData),clientDataJSON:c(r.clientDataJSON),signature:c(r.signature),...r.userHandle&&{userHandle:c(r.userHandle)}}}});return await n.getHttpClient().post(a,o)};var A=async(n,e,t)=>{let s="/frontend-api/sessions/mfa/register/fido2/init",i=JSON.stringify({session_id:e,username:t});return await n.getHttpClient().post(s,i)},b=async(n,e,t,s,i,r)=>{let a=i.response,o=[];typeof a.getTransports<"u"&&(o=a.getTransports());let d="/frontend-api/sessions/mfa/register/fido2/complete",l=JSON.stringify({session_id:e,username:t,cred_name:r,attestation_response:{id:c(i.rawId),challenge:s.challenge,type:"public-key",response:{attestationObject:c(a.attestationObject),clientDataJSON:c(a.clientDataJSON),transports:o}}});return await n.getHttpClient().post(d,l)};var w=class{_config;constructor(e){this._config=e;}async signupWithPasskey(e,t){let s;t&&(s=t.credname);let i=await p(this._config),r=await A(this._config,i.session_id,e),a=await y(r),o=await b(this._config,i.session_id,e,r,a,s),d=await g(this._config,i.session_id);return {user:{user_uuid:o.user.user_uuid,username:o.user.username,created_at:o.user.created_at,last_login:o.user.last_login,is_active:o.user.is_active},auth_data:{token:d.access_token,expires_in:d.expires_in}}}async signinWithPasskey(e){let t=await p(this._config),s=await P(this._config,t.session_id,e||null),i=await _(s),r=await k(this._config,t.session_id,e||null,s,i),a=await g(this._config,t.session_id);return {user:{user_uuid:r.user.user_uuid,username:r.user.username,created_at:r.user.created_at,last_login:r.user.last_login,is_active:r.user.is_active},auth_data:{token:a.access_token,expires_in:a.expires_in}}}};var f=async(n,e)=>{let t=`/frontend-api/sessions/mfa/${e}/credentials/email/wait`;return await n.getHttpClient().ws(t,5)};var j=async(n,e,t)=>{let s="/frontend-api/sessions/users/credentials/fido2/init",i=[["Authorization",`Bearer ${e}`]],r=JSON.stringify({username:t});return await n.getHttpClient().post(s,r,i)},J=async(n,e,t,s,i,r,a)=>{let o=i.response,d=[];typeof o.getTransports<"u"&&(d=o.getTransports());let l="/frontend-api/sessions/users/credentials/fido2/complete",I=[["Authorization",`Bearer ${e}`]],R=JSON.stringify({session_pin:r,username:t,cred_name:a,attestation_response:{id:c(i.rawId),challenge:s.challenge,type:"public-key",response:{attestationObject:c(o.attestationObject),clientDataJSON:c(o.clientDataJSON),transports:d}}});return await n.getHttpClient().post(l,R,I)};var v=class{_config;constructor(e){this._config=e;}async addPasskeyWithToken(e,t,s){let i;s&&(i=s.credname);let r=await j(this._config,t,e),a=await y(r);return await J(this._config,t,e,r,a,void 0,i)}};var q=async(n,e,t)=>{let s="/frontend-api/sessions/mfa/authenticate/email/init",i=JSON.stringify({session_id:e,username:t});await n.getHttpClient().post(s,i);};var x=async(n,e,t)=>{let s="/frontend-api/sessions/mfa/register/email/init",i=JSON.stringify({session_id:e,username:t});await n.getHttpClient().post(s,i);};var E=class{_config;constructor(e){this._config=e;}async signupWithEmail(e){let t=await p(this._config,"enforce-email-verification-link");await x(this._config,t.session_id,e);let s=await f(this._config,t.session_id),i=await g(this._config,t.session_id);return {user:{user_uuid:s.user.user_uuid,username:s.user.username,created_at:s.user.created_at,last_login:s.user.last_login,is_active:s.user.is_active},auth_data:{token:i.access_token,expires_in:i.expires_in}}}async signinWithEmail(e){let t=await p(this._config,"enforce-email-verification-link");await q(this._config,t.session_id,e);let s=await f(this._config,t.session_id),i=await g(this._config,t.session_id);return {user:{user_uuid:s.user.user_uuid,username:s.user.username,created_at:s.user.created_at,last_login:s.user.last_login,is_active:s.user.is_active},auth_data:{token:i.access_token,expires_in:i.expires_in}}}};var S=class{_baseUrl;_appId;_httpClient;constructor(e,t){this._baseUrl=e,this._appId=t,this._httpClient=new h(this._baseUrl);}getBaseUrl(){return this._baseUrl}getAppId(){return this._appId}getHttpClient(){return this._httpClient}};

//Service for local server
const login = (username, token) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "/login";
    const response = yield fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, token }),
    });
    if (!response.ok) {
        const data = yield response.json();
        throw new Error(data.message);
    }
    //handle redirect
    if (response.redirected) {
        window.location.href = response.url;
    }
});

const loginForm = document.getElementById("login");
const addPasskeyForm = document.getElementById("add-passkey");
const header = document.querySelector(".title");
const usernameInput = document.getElementById("username");
const emailMessage = document.querySelector(".email-message");
const errorMessage = document.querySelector(".error-message");
const skipButton = document.getElementById("skip-button");
const loginButton = document.getElementById("login-button");
const addPasskeyButton = document.getElementById("add-passkey-button");
const appId = "58zyiHCxbai3BcFZyhcxHA" ;
const baseUrl = "https://gvlbddttycr2pmqlvege4q.gen2.qa.loginid.io" ;
//initialize the sdk
const loginIdConfiguration = new S(baseUrl, appId);
const loginIdPasskey = new w(loginIdConfiguration);
const loginIdEmail = new E(loginIdConfiguration);
const loginIdCredentials = new v(loginIdConfiguration);
let username = "";
let token = "";
const addPasskeyView = () => {
    //change state to add passkey
    header.remove();
    emailMessage.remove();
    loginForm.remove();
    addPasskeyForm.style.display = "block";
};
loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    emailMessage.style.display = "none";
    errorMessage.style.display = "none";
    username = usernameInput.value;
    //attempt to signin with passkeys
    try {
        try {
            const { auth_data } = yield loginIdPasskey.signinWithPasskey(username);
            yield login(username, auth_data.token);
            return;
        }
        catch (e) {
            if (e instanceof u) {
                //user does not exists with LoginID
                //sign up with email verification
                //offer to add passkey
                if (e.getErrorCategory() === "not_found" &&
                    e.getErrorCode() === "unknown_user") {
                    loginButton.remove();
                    emailMessage.style.display = "block";
                    const { auth_data } = yield loginIdEmail.signupWithEmail(username);
                    token = auth_data.token;
                    //change state to add passkey
                    addPasskeyView();
                    return;
                }
                //user exists with LoginID but does not have passkeys
                //sign in with email verification
                //offer to add passkey
                if (e.getErrorCategory() === "not_found" &&
                    e.getErrorCode() === "no_authenticators_found") {
                    loginButton.remove();
                    emailMessage.style.display = "block";
                    const { auth_data } = yield loginIdEmail.signinWithEmail(username);
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
            const { auth_data } = yield loginIdEmail.signinWithEmail(username);
            token = auth_data.token;
            yield login(username, token);
            return;
        }
    }
    catch (e) {
        if (e instanceof Error) {
            errorMessage.style.display = "block";
            errorMessage.innerHTML = e.message;
        }
    }
}));
addPasskeyButton === null || addPasskeyButton === void 0 ? void 0 : addPasskeyButton.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    try {
        yield loginIdCredentials.addPasskeyWithToken(username, token);
        //send token to server to be verified
        yield login(username, token);
    }
    catch (e) {
        if (e instanceof Error) {
            errorMessage.style.display = "block";
            errorMessage.innerHTML = e.message;
        }
    }
}));
skipButton === null || skipButton === void 0 ? void 0 : skipButton.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    try {
        //send token to server to be verified
        yield login(username, token);
    }
    catch (e) {
        if (e instanceof Error) {
            errorMessage.style.display = "block";
            errorMessage.innerHTML = e.message;
        }
    }
}));
