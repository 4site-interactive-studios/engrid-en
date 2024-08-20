# 4Site's Engaging Networks Free & Flexible Page Template

This is a free and flexible page template for Engaging Networks. It is designed to be easy to use and customise. It is built using Typescript and SCSS.

## One-Click Donation Page Customization

The new features created for the One Click Donation Page are:

- Ability to change the submit button label
- Ability to set a currency symbol to be added to the donation amount and "other" amount fields
- Ability to set the position of the currency symbol (left or right)

You can customise the submit button label, currency symbol and its position by adding the following JavaScript variables to your One-Click Donation Page [https://cln.sh/1gWXBKPH](https://cln.sh/1gWXBKPH):

```html
<script>
  window.SubmitLabel = "DONATE $AMOUNT$CURRENCY";
  window.CurrencyPosition = "right";
  window.CurrencySymbol = "￡";
</script>
```

- If there's no `window.SubmitLabel`, the submit button label will not be changed.
- If there's no `window.CurrencyPosition`, the currency symbol will be placed on the left.
- If there's no `window.CurrencySymbol`, the default symbol `$` will be used.
