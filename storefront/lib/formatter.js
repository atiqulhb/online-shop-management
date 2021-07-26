const formatter = new Intl.NumberFormat('en-NZ', {
  style: 'currency',
  currency: 'BDT',
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
})

export default formatter