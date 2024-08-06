import "./sass/main.scss";

import {
  Loader,
  ENGrid,
  Options,
  OptionsDefaults,
  DataAttributes,
  EngridLogger,
  AppVersion,
} from "@4site/engrid-common";

class App {
  private options: Options;
  private isOneClickDonation: boolean = false;

  private logger = new EngridLogger("App", "black", "white", "🍏");

  constructor(options: Options) {
    const loader = new Loader();
    this.options = { ...OptionsDefaults, ...options };
    this.isOneClickDonation = ENGrid.getField("donationLogId") ? true : false;
    // Add Options to window
    (window as any).EngridOptions = this.options;
    if (loader.reload()) return;
    // Turn Debug ON if you use local assets
    if (
      ENGrid.getBodyData("assets") === "local" &&
      ENGrid.getUrlParameter("debug") !== "false" &&
      ENGrid.getUrlParameter("debug") !== "log"
    ) {
      (window as any).EngridOptions.Debug = true;
    }

    // Document Load
    if (document.readyState !== "loading") {
      this.isOneClickDonation ? this.runOnOneClickDonation() : this.run();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        this.isOneClickDonation ? this.runOnOneClickDonation() : this.run();
      });
    }
    // Window Resize
    window.onresize = () => {
      this.onResize();
    };
  }

  private run() {
    if (
      !ENGrid.checkNested(
        (window as any).EngagingNetworks,
        "require",
        "_defined",
        "enjs"
      )
    ) {
      this.logger.danger("Engaging Networks JS Framework NOT FOUND");
      setTimeout(() => {
        this.run();
      }, 100);
      return;
    }
    // If there's an option object on the page, override the defaults
    if (window.hasOwnProperty("EngridPageOptions")) {
      this.options = { ...this.options, ...(window as any).EngridPageOptions };
      // Add Options to window
      (window as any).EngridOptions = this.options;
    }

    // If there's no pageJson.pageType, add a big red warning to the console
    if (!ENGrid.checkNested(window, "pageJson", "pageType")) {
      window.setTimeout(() => {
        console.log(
          "%c ⛔️ pageJson.pageType NOT FOUND - Go to the Account Settings and Expose the Transaction Details %s",
          "background-color: red; color: white; font-size: 22px; font-weight: bold;",
          "https://knowledge.engagingnetworks.net/datareports/expose-transaction-details-pagejson"
        );
      }, 2000);
    }

    if (this.options.Debug || ENGrid.getUrlParameter("debug") == "true")
      // Enable debug if available is the first thing
      ENGrid.setBodyData("debug", "");

    new DataAttributes();

    ENGrid.setBodyData("data-engrid-scripts-js-loading", "finished");

    (window as any).EngridVersion = AppVersion;
    this.logger.success(`VERSION: ${AppVersion}`);

    // Window Load
    let onLoad = typeof window.onload === "function" ? window.onload : null;
    if (document.readyState !== "loading") {
      this.onLoad();
    } else {
      window.onload = (e: Event) => {
        this.onLoad();
        if (onLoad) {
          onLoad.bind(window, e);
        }
      };
    }
  }

  private onLoad() {
    if (this.options.onLoad) {
      this.options.onLoad();
    }
  }

  private onResize() {
    if (this.options.onResize) {
      this.options.onResize();
    }
  }

  public static log(message: string) {
    const logger = new EngridLogger("Client", "brown", "aliceblue", "🍪");
    logger.log(message);
  }

  private runOnOneClickDonation() {
    App.log("One Click Donation Page");

    // If there's an option object on the page, override the defaults
    if (window.hasOwnProperty("EngridPageOptions")) {
      this.options = { ...this.options, ...(window as any).EngridPageOptions };
      // Add Options to window
      (window as any).EngridOptions = this.options;
    }

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
        const otherAmount = ENGrid.getField(
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
          ENGrid.cleanAmount(getAmount())
        ).replace(
          "$CURRENCY",
          ENGrid.getCurrencySymbol() || this.options.CurrencySymbol
        );
      }
    };
    ENGrid.setBodyData("page-type", "one-click-donation");

    new DataAttributes();
    // Fix the amount labels
    let amountButtons = document.querySelectorAll(
      ".enDonationAmount__buttons .en__field__item"
    ) as NodeListOf<HTMLLabelElement>;
    const currencySymbol = ENGrid.getCurrencySymbol() || "";
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
        ENGrid.getCurrencySymbol()
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

const options: Options = {
  CurrencySymbol: "$",
  CurrencySeparator: ".",
  Debug: ENGrid.getUrlParameter("debug") == "true" ? true : false,
  onLoad: () => console.log("EN Free & Flexible Theme Loaded"),
  onResize: () => console.log("EN Free & Flexible Theme Window Resized"),
};

new App(options);
