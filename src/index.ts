import "./sass/main.scss";

import { EN, DataAttributes } from "./lib";

class App {
  private isOneClickDonation: boolean = false;

  constructor() {
    this.isOneClickDonation = EN.getField("donationLogId") ? true : false;
    // Turn Debug ON
    if (EN.getUrlParameter("debug") === "true") {
      (window as any).Debug = true;
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

  public static log(message: string) {
    return console.log(
      "%c 4️⃣ %s",
      `color: #fefefe; background-color: #333; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`,
      message
    );
  }

  private runOnOneClickDonation() {
    App.log("One Click Donation Page");

    const getCurrencyPosition = () => {
      return (window as any).CurrencyPosition &&
        (window as any).CurrencyPosition.toLowerCase() === "right"
        ? "right"
        : "left";
    };

    const getAmount = () => {
      const amount = document.querySelector(
        ".enDonationAmount__buttons input:checked"
      ) as HTMLInputElement;
      if (!amount) return "0";
      if (amount.value === "other") {
        const otherAmount = EN.getField(
          "transaction.donationAmt.other"
        ) as HTMLInputElement;
        if (otherAmount) {
          otherAmount.focus();
          return otherAmount.value;
        }
      }
      return amount.value;
    };

    const updateSubmitButton = () => {
      if (!(window as any).SubmitLabel) return;
      const submitButton = document.querySelector(
        ".eaSubmitButton"
      ) as HTMLInputElement;
      if (submitButton) {
        submitButton.value = (window as any).SubmitLabel.replace(
          "$AMOUNT",
          EN.cleanAmount(getAmount())
        ).replace("$CURRENCY", EN.getCurrencySymbol() || "");
      }
    };
    EN.setBodyData("page-type", "one-click-donation");

    new DataAttributes();
    // Fix the amount labels
    let amountButtons = document.querySelectorAll(
      ".enDonationAmount__buttons .en__field__item"
    ) as NodeListOf<HTMLLabelElement>;
    const currencySymbol = EN.getCurrencySymbol() || "";
    amountButtons.forEach((element) => {
      const label = element.querySelector("label") as HTMLLabelElement;
      if (label && !isNaN(label.innerText as any)) {
        label.innerText =
          getCurrencyPosition() === "left"
            ? currencySymbol + label.innerText
            : label.innerText + currencySymbol;
      }
      const input = element.querySelector("input") as HTMLInputElement;

      if (input && input.name === "transaction.donationAmt.other") {
        input.addEventListener("keyup", (e: Event) => {
          updateSubmitButton();
        });
      } else {
        // Attach event listener to both label and input
        const triggerChange = (e: Event) => {
          window.setTimeout(() => {
            updateSubmitButton();
          }, 110);
        };

        label.addEventListener("click", triggerChange);
        input.addEventListener("change", triggerChange);
      }
    });

    const otherFieldContainer = document.querySelector(
      ".en__field__item--other"
    ) as HTMLInputElement;
    if (otherFieldContainer) {
      otherFieldContainer.setAttribute(
        "data-currency-symbol",
        EN.getCurrencySymbol()
      );
      otherFieldContainer.setAttribute(
        "data-currency-position",
        getCurrencyPosition()
      );
    }
    // Custom Submit Button Label
    updateSubmitButton();
  }
}

new App();
