export {}; // this file needs to be a module
declare global {
  interface Window {
    pageJson: any;
    enOnSubmit: any;
    enOnError: any;
    enOnValidate: any;
    EngagingNetworks: any;
    CurrencyCode: any;
    CurrencySymbol: any;
    CurrencyPosition: any;
    SubmitLabel: any;
    debug: any;
    enVGSFields: any;
  }
}
