/*!
 * 
 *                ((((
 *          ((((((((
 *       (((((((
 *     (((((((           ****
 *   (((((((          *******
 *  ((((((((       **********     *********       ****    ***
 *  ((((((((    ************   **************     ***    ****
 *  ((((((   *******  *****   *****        *     **    ******        *****
 *  (((   *******    ******   ******            ****  ********   ************
 *      *******      *****     **********      ****    ****     ****      ****
 *    *********************         *******   *****   ****     ***************
 *     ********************            ****   ****    ****    ****
 *                 *****    *****   *******  *****   *****     *****     **
 *                *****     *************    ****    *******     **********
 *
 *  ENGRID PAGE TEMPLATE ASSETS
 *
 *  Date: Tuesday, August 20, 2024 @ 16:25:45 ET
 *  By: fernando
 *  ENGrid styles: v0.19.1
 *  ENGrid scripts: custom
 *
 *  Created by 4Site Studios
 *  Come work with us or join our team, we would love to hear from you
 *  https://www.4sitestudios.com/en
 *
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js

function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}

;// CONCATENATED MODULE: ./src/lib/en.ts
class EN {
  constructor() {
    throw new Error("This class cannot be instantiated.");
  }
  static get debug() {
    return !!this.getOption("debug");
  }

  // Return any parameter from the URL
  static getUrlParameter(name) {
    const searchParams = new URLSearchParams(window.location.search);
    // Add support for array on the name ending with []
    if (name.endsWith("[]")) {
      let values = [];
      searchParams.forEach((value, key) => {
        if (key.startsWith(name.replace("[]", ""))) {
          values.push(new Object({
            [key]: value
          }));
        }
      });
      return values.length > 0 ? values : null;
    }
    if (searchParams.has(name)) {
      return searchParams.get(name) || true;
    }
    return null;
  }
  static getField(name) {
    // Get the field by name
    return document.querySelector(`[name="${name}"]`);
  }
  // Set body engrid data attributes
  static setBodyData(dataName, value) {
    const body = document.querySelector("body");
    // If value is boolean
    if (typeof value === "boolean" && value === false) {
      body.removeAttribute(`data-engrid-${dataName}`);
      return;
    }
    body.setAttribute(`data-engrid-${dataName}`, value.toString());
  }

  // Get body engrid data attributes
  static getBodyData(dataName) {
    const body = document.querySelector("body");
    return body.getAttribute(`data-engrid-${dataName}`);
  }
  // Check if body has engrid data attributes
  static hasBodyData(dataName) {
    const body = document.querySelector("body");
    return body.hasAttribute(`data-engrid-${dataName}`);
  }

  // Return the option value
  static getOption(key) {
    return window[key] || null;
  }
  // Clean an Amount
  static cleanAmount(amount) {
    // Split the number
    const valueArray = amount.replace(/[^0-9,\.]/g, "").split(/[,.]+/);
    const delimArray = amount.replace(/[^.,]/g, "").split("");
    // Handle values with no decimal places and non-numeric values
    if (valueArray.length === 1) {
      return parseInt(valueArray[0]) || 0;
    }
    // Ignore invalid numbers
    if (valueArray.map((x, index) => {
      return index > 0 && index + 1 !== valueArray.length && x.length !== 3 ? true : false;
    }).includes(true)) {
      return 0;
    }
    // Multiple commas is a bad thing? So edgy.
    if (delimArray.length > 1 && !delimArray.includes(".")) {
      return 0;
    }
    // Handle invalid decimal and comma formatting
    if ([...new Set(delimArray.slice(0, -1))].length > 1) {
      return 0;
    }
    // If there are cents
    if (valueArray[valueArray.length - 1].length <= 2) {
      const cents = valueArray.pop() || "00";
      return parseInt(cents) > 0 ? parseFloat(Number(parseInt(valueArray.join("")) + "." + cents).toFixed(2)) : parseInt(valueArray.join(""));
    }
    return parseInt(valueArray.join(""));
  }
  static formatDate(date, format = "MM/DD/YYYY") {
    const dateAray = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).split("/");
    const dateString = format.replace(/YYYY/g, dateAray[2]).replace(/MM/g, dateAray[0]).replace(/DD/g, dateAray[1]).replace(/YY/g, dateAray[2].substr(2, 2));
    return dateString;
  }
  /**
   * Check if the provided object has ALL the provided properties
   * Example: checkNested(EngagingNetworks, 'require', '_defined', 'enjs', 'checkSubmissionFailed')
   * will return true if EngagingNetworks.require._defined.enjs.checkSubmissionFailed is defined
   */
  static checkNested(obj, ...args) {
    for (let i = 0; i < args.length; i++) {
      if (!obj || !obj.hasOwnProperty(args[i])) {
        return false;
      }
      obj = obj[args[i]];
    }
    return true;
  }

  // Deep merge two objects
  static deepMerge(target, source) {
    for (const key in source) {
      if (source[key] instanceof Object) Object.assign(source[key], EN.deepMerge(target[key], source[key]));
    }
    Object.assign(target || {}, source);
    return target;
  }
  static getCurrencySymbol() {
    const currencyField = EN.getField("transaction.paycurrency");
    if (currencyField) {
      // Check if the selected currency field option have a data-currency-symbol attribute
      const selectedOption = currencyField.tagName === "SELECT" ? currencyField.options[currencyField.selectedIndex] : currencyField;
      if (selectedOption.dataset.currencySymbol) {
        return selectedOption.dataset.currencySymbol;
      }
      const currencyArray = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        AUD: "$",
        CAD: "$",
        JPY: "¥"
      };
      return currencyArray[currencyField.value] || "$";
    }
    return window.CurrencySymbol || "$";
  }
  static getCurrencyCode() {
    const currencyField = EN.getField("transaction.paycurrency");
    if (currencyField) {
      return currencyField.value || "USD";
    }
    return window.CurrencyCode || "USD";
  }
}
;// CONCATENATED MODULE: ./src/lib/data-attributes.ts
// Component that adds data attributes to the Body


class DataAttributes {
  constructor() {
    this.setDataAttributes();
  }
  setDataAttributes() {
    // Add the Page Type as a Data Attribute on the Body Tag
    if (EN.checkNested(window, "pageJson", "pageType")) {
      EN.setBodyData("page-type", window.pageJson.pageType);
    }

    // Add the currency code as a Data Attribute on the Body Tag
    EN.setBodyData("currency-code", EN.getCurrencyCode());
    const otherAmountDiv = document.querySelector(".en__field--donationAmt .en__field__item--other");
    if (otherAmountDiv) {
      otherAmountDiv.setAttribute("data-currency-symbol", EN.getCurrencySymbol());
    }
  }
}
;// CONCATENATED MODULE: ./src/index.ts



class App {
  constructor() {
    _defineProperty(this, "isOneClickDonation", false);
    this.isOneClickDonation = EN.getField("donationLogId") ? true : false;
    // Turn Debug ON
    if (EN.getUrlParameter("debug") === "true") {
      window.Debug = true;
    }

    // Document Load
    if (document.readyState !== "loading") {
      this.isOneClickDonation && this.runOnOneClickDonation();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        this.isOneClickDonation && this.runOnOneClickDonation();
      });
    }
  }
  static log(message) {
    return console.log("%c 4️⃣ %s", `color: #fefefe; background-color: #333; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`, message);
  }
  runOnOneClickDonation() {
    App.log("One Click Donation Page");
    const getCurrencyPosition = () => {
      return window.CurrencyPosition && window.CurrencyPosition.toLowerCase() === "right" ? "right" : "left";
    };
    const getAmount = () => {
      const amount = document.querySelector(".enDonationAmount__buttons input:checked");
      if (!amount) return "0";
      if (amount.value === "other") {
        const otherAmount = EN.getField("transaction.donationAmt.other");
        if (otherAmount) {
          otherAmount.focus();
          return otherAmount.value;
        }
      }
      return amount.value;
    };
    const updateSubmitButton = () => {
      if (!window.SubmitLabel) return;
      const submitButton = document.querySelector(".eaSubmitButton");
      if (submitButton) {
        submitButton.value = window.SubmitLabel.replace("$AMOUNT", EN.cleanAmount(getAmount())).replace("$CURRENCY", EN.getCurrencySymbol() || "");
      }
    };
    EN.setBodyData("page-type", "one-click-donation");
    new DataAttributes();
    // Fix the amount labels
    let amountButtons = document.querySelectorAll(".enDonationAmount__buttons .en__field__item");
    const currencySymbol = EN.getCurrencySymbol() || "";
    amountButtons.forEach(element => {
      const label = element.querySelector("label");
      if (label && !isNaN(label.innerText)) {
        label.innerText = getCurrencyPosition() === "left" ? currencySymbol + label.innerText : label.innerText + currencySymbol;
      }
      const input = element.querySelector("input");
      if (input && input.name === "transaction.donationAmt.other") {
        input.addEventListener("keyup", e => {
          updateSubmitButton();
        });
      } else {
        // Attach event listener to both label and input
        const triggerChange = e => {
          window.setTimeout(() => {
            updateSubmitButton();
          }, 110);
        };
        label.addEventListener("click", triggerChange);
        input.addEventListener("change", triggerChange);
      }
    });
    const otherFieldContainer = document.querySelector(".en__field__item--other");
    if (otherFieldContainer) {
      otherFieldContainer.setAttribute("data-currency-symbol", EN.getCurrencySymbol());
      otherFieldContainer.setAttribute("data-currency-position", getCurrencyPosition());
    }
    // Custom Submit Button Label
    updateSubmitButton();
  }
}
new App();
/******/ })()
;