const extensions = () => {
  Number.prototype.toFloat = function (
    this: number,
    fractionDigits = 2,
  ): number {
    return parseFloat(this.toFixed(fractionDigits));
  };
};

extensions();
