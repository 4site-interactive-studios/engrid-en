// Component that adds data attributes to the Body

import { EN } from ".";

export class DataAttributes {
  constructor() {
    this.setDataAttributes();
  }

  private setDataAttributes() {
    // Add the Page Type as a Data Attribute on the Body Tag
    if (EN.checkNested(window, "pageJson", "pageType")) {
      EN.setBodyData("page-type", window.pageJson.pageType);
    }

    // Add the currency code as a Data Attribute on the Body Tag
    EN.setBodyData("currency-code", EN.getCurrencyCode());

    const otherAmountDiv = document.querySelector(
      ".en__field--donationAmt .en__field__item--other"
    );
    if (otherAmountDiv) {
      otherAmountDiv.setAttribute(
        "data-currency-symbol",
        EN.getCurrencySymbol()
      );
    }
  }
}
