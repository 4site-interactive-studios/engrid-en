export abstract class EN {
  constructor() {
    throw new Error("This class cannot be instantiated.");
  }

  static get debug(): boolean {
    return !!this.getOption("debug");
  }

  // Return any parameter from the URL
  static getUrlParameter(name: string) {
    const searchParams = new URLSearchParams(window.location.search);
    // Add support for array on the name ending with []
    if (name.endsWith("[]")) {
      let values: Object[] = [];
      searchParams.forEach((value, key) => {
        if (key.startsWith(name.replace("[]", ""))) {
          values.push(new Object({ [key]: value }));
        }
      });
      return values.length > 0 ? values : null;
    }
    if (searchParams.has(name)) {
      return searchParams.get(name) || true;
    }
    return null;
  }
  static getField(name: string) {
    // Get the field by name
    return document.querySelector(`[name="${name}"]`);
  }
  // Set body engrid data attributes
  static setBodyData(dataName: string, value: string | boolean) {
    const body = <HTMLBodyElement>document.querySelector("body");
    // If value is boolean
    if (typeof value === "boolean" && value === false) {
      body.removeAttribute(`data-engrid-${dataName}`);
      return;
    }
    body.setAttribute(`data-engrid-${dataName}`, value.toString());
  }

  // Get body engrid data attributes
  static getBodyData(dataName: string) {
    const body = <HTMLBodyElement>document.querySelector("body");
    return body.getAttribute(`data-engrid-${dataName}`);
  }
  // Check if body has engrid data attributes
  static hasBodyData(dataName: string) {
    const body = <HTMLBodyElement>document.querySelector("body");
    return body.hasAttribute(`data-engrid-${dataName}`);
  }

  // Return the option value
  static getOption<K extends keyof Window>(key: K): Window[K] | null {
    return window[key] || null;
  }
  // Clean an Amount
  static cleanAmount(amount: string): number {
    // Split the number
    const valueArray = amount.replace(/[^0-9,\.]/g, "").split(/[,.]+/);
    const delimArray = amount.replace(/[^.,]/g, "").split("");
    // Handle values with no decimal places and non-numeric values
    if (valueArray.length === 1) {
      return parseInt(valueArray[0]) || 0;
    }
    // Ignore invalid numbers
    if (
      valueArray
        .map((x, index) => {
          return index > 0 && index + 1 !== valueArray.length && x.length !== 3
            ? true
            : false;
        })
        .includes(true)
    ) {
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
      return parseInt(cents) > 0
        ? parseFloat(
            Number(parseInt(valueArray.join("")) + "." + cents).toFixed(2)
          )
        : parseInt(valueArray.join(""));
    }
    return parseInt(valueArray.join(""));
  }
  static formatDate(date: Date, format: string = "MM/DD/YYYY") {
    const dateAray = date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split("/");
    const dateString = format
      .replace(/YYYY/g, dateAray[2])
      .replace(/MM/g, dateAray[0])
      .replace(/DD/g, dateAray[1])
      .replace(/YY/g, dateAray[2].substr(2, 2));
    return dateString;
  }
  /**
   * Check if the provided object has ALL the provided properties
   * Example: checkNested(EngagingNetworks, 'require', '_defined', 'enjs', 'checkSubmissionFailed')
   * will return true if EngagingNetworks.require._defined.enjs.checkSubmissionFailed is defined
   */
  static checkNested(obj: any, ...args: string[]) {
    for (let i = 0; i < args.length; i++) {
      if (!obj || !obj.hasOwnProperty(args[i])) {
        return false;
      }
      obj = obj[args[i]];
    }
    return true;
  }

  // Deep merge two objects
  static deepMerge(target: any, source: any) {
    for (const key in source) {
      if (source[key] instanceof Object)
        Object.assign(source[key], EN.deepMerge(target[key], source[key]));
    }
    Object.assign(target || {}, source);
    return target;
  }

  static getCurrencySymbol(): string {
    const currencyField = EN.getField(
      "transaction.paycurrency"
    ) as HTMLSelectElement;
    if (currencyField) {
      // Check if the selected currency field option have a data-currency-symbol attribute
      const selectedOption =
        currencyField.tagName === "SELECT"
          ? currencyField.options[currencyField.selectedIndex]
          : currencyField;
      if (selectedOption.dataset.currencySymbol) {
        return selectedOption.dataset.currencySymbol;
      }
      const currencyArray = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        AUD: "$",
        CAD: "$",
        JPY: "¥",
      };
      return (currencyArray as any)[currencyField.value] || "$";
    }
    return window.CurrencySymbol || "$";
  }
  static getCurrencyCode(): string {
    const currencyField = EN.getField(
      "transaction.paycurrency"
    ) as HTMLSelectElement;
    if (currencyField) {
      return currencyField.value || "USD";
    }
    return window.CurrencyCode || "USD";
  }
}
