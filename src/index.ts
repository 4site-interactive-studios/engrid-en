import "./sass/main.scss";

import {
  DonationAmount,
  DonationFrequency,
  EnForm,
  Country,
} from "@4site/engrid-common";
import {
  AmountLabel,
  Loader,
  ENGrid,
  Options,
  OptionsDefaults,
  A11y,
  Advocacy,
  DataAttributes,
  LiveVariables,
  InputPlaceholders,
  InputHasValueAndFocus,
  ShowHideRadioCheckboxes,
  AutoCountrySelect,
  AutoYear,
  Autocomplete,
  TranslateFields,
  ShowIfAmount,
  EngridLogger,
  OtherAmount,
  DataReplace,
  DataHide,
  AppVersion,
  UrlToForm,
  DataLayer,
  LiveCurrency,
  Autosubmit,
  DebugHiddenFields,
  LiveFrequency,
  CustomCurrency,
  VGS,
} from "@4site/engrid-common";

class App {
  // Events
  private _form: EnForm = EnForm.getInstance();
  private _amount: DonationAmount = DonationAmount.getInstance(
    "transaction.donationAmt",
    "transaction.donationAmt.other"
  );
  private _frequency: DonationFrequency = DonationFrequency.getInstance();
  private _country: Country = Country.getInstance();
  private _dataLayer: DataLayer;

  private options: Options;
  private isOneClickDonation: boolean = false;

  private logger = new EngridLogger("App", "black", "white", "🍏");

  constructor(options: Options) {
    const loader = new Loader();
    this.options = { ...OptionsDefaults, ...options };
    this.isOneClickDonation = ENGrid.getField("donationLogId") ? true : false;
    // Add Options to window
    (window as any).EngridOptions = this.options;
    this._dataLayer = DataLayer.getInstance();
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

    new Advocacy();

    new InputPlaceholders();
    new InputHasValueAndFocus();

    new ShowHideRadioCheckboxes("transaction.giveBySelect", "giveBySelect-");
    new ShowHideRadioCheckboxes("transaction.inmem", "inmem-");
    new ShowHideRadioCheckboxes("transaction.recurrpay", "recurrpay-");

    // Automatically show/hide all radios
    let radioFields: string[] = [];
    const allRadios: NodeListOf<HTMLInputElement> =
      document.querySelectorAll("input[type=radio]");
    allRadios.forEach((radio) => {
      if ("name" in radio && radioFields.includes(radio.name) === false) {
        radioFields.push(radio.name);
      }
    });
    radioFields.forEach((field) => {
      new ShowHideRadioCheckboxes(
        field,
        "engrid__" + field.replace(/\./g, "") + "-"
      );
    });

    // Automatically show/hide all checkboxes
    const allCheckboxes: NodeListOf<HTMLInputElement> =
      document.querySelectorAll("input[type=checkbox]");
    allCheckboxes.forEach((checkbox) => {
      if ("name" in checkbox) {
        new ShowHideRadioCheckboxes(
          checkbox.name,
          "engrid__" + checkbox.name.replace(/\./g, "") + "-"
        );
      }
    });

    // Client onSubmit and onError functions
    this._form.onSubmit.subscribe(() => this.onSubmit());
    this._form.onError.subscribe(() => this.onError());
    this._form.onValidate.subscribe(() => this.onValidate());

    // Event Listener Examples
    this._amount.onAmountChange.subscribe((s) =>
      this.logger.success(`Live Amount: ${s}`)
    );
    this._frequency.onFrequencyChange.subscribe((s) => {
      this.logger.success(`Live Frequency: ${s}`);
      setTimeout(() => {
        this._amount.load();
      }, 150);
    });
    this._form.onSubmit.subscribe((s) =>
      this.logger.success("Submit: " + JSON.stringify(s))
    );
    this._form.onError.subscribe((s) =>
      this.logger.danger("Error: " + JSON.stringify(s))
    );
    this._country.onCountryChange.subscribe((s) =>
      this.logger.success(`Country: ${s}`)
    );

    (window as any).EnOnSubmit = () => {
      this._form.submit = true;
      this._form.submitPromise = false;
      this._form.dispatchSubmit();
      ENGrid.watchForError(ENGrid.enableSubmit);
      if (!this._form.submit) return false;
      if (this._form.submitPromise) return this._form.submitPromise;
      this.logger.success("enOnSubmit Success");
      // If all validation passes, we'll watch for Digital Wallets Errors, which
      // will not reload the page (thanks EN), so we will enable the submit button if
      // an error is programmatically thrown by the Digital Wallets
      return true;
    };
    (window as any).EnOnError = () => {
      this._form.dispatchError();
    };
    (window as any).EnOnValidate = () => {
      this._form.validate = true;
      this._form.validatePromise = false;
      this._form.dispatchValidate();
      if (!this._form.validate) return false;
      if (this._form.validatePromise) return this._form.validatePromise;
      this.logger.success("Validation Passed");
      return true;
    };

    // Live Variables
    new LiveVariables(this.options);

    // Amount Labels
    new AmountLabel();

    // Engrid Data Replacement
    new DataReplace();

    // ENgrid Hide Script
    new DataHide();

    // Autosubmit script
    new Autosubmit();

    // On the end of the script, after all subscribers defined, let's load the current frequency
    // The amount will be loaded by the frequency change event
    // This timeout is needed because when you have alternative amounts, EN is slower than Engrid
    // about 20% of the time and we get a race condition if the client is also using the SwapAmounts feature
    window.setTimeout(() => {
      this._frequency.load();
    }, 1000);

    // Currency Related Components
    new LiveCurrency();
    new CustomCurrency();

    // Auto Country Select
    new AutoCountrySelect();

    // Auto Year Class
    if (this.options.AutoYear) new AutoYear();
    // Autocomplete Class
    new Autocomplete();

    new ShowIfAmount();

    new OtherAmount();

    new A11y();

    // Url Params to Form Fields
    new UrlToForm();

    //Debug hidden fields
    if (this.options.Debug) new DebugHiddenFields();

    // Translate Fields
    if (this.options.TranslateFields) new TranslateFields();

    // Live Frequency
    new LiveFrequency();

    // Very Good Security
    new VGS();

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

  private onValidate() {
    if (this.options.onValidate) {
      this.logger.log("Client onValidate Triggered");
      this.options.onValidate();
    }
  }

  private onSubmit() {
    if (this.options.onSubmit) {
      this.logger.log("Client onSubmit Triggered");
      this.options.onSubmit();
    }
  }

  private onError() {
    if (this.options.onError) {
      this.logger.danger("Client onError Triggered");
      this.options.onError();
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
  Debug: true,
  onLoad: () => console.log("EN Free & Flexible Theme Loaded"),
  onResize: () => console.log("EN Free & Flexible Theme Window Resized"),
};

new App(options);
