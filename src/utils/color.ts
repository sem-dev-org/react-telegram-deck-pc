export const hexToP3 = (hex: string) => {
  const aRgbHex = hex.replace('#', '').match(/.{1,2}/g);
  if (!aRgbHex) return null;
  const aRgb = [
    (parseInt(aRgbHex[0], 16) / 255).toFixed(2),
    (parseInt(aRgbHex[1], 16) / 255).toFixed(2),
    (parseInt(aRgbHex[2], 16) / 255).toFixed(2),
  ];
  return `color(display-p3 ${aRgb.join(' ')})`;
};

export const hexToRgba = (hex: string, opacity: number) => {
  const aRgbHex = hex.replace('#', '').match(/.{1,2}/g);
  if (!aRgbHex) return null;
  return `rgba(${aRgbHex.join(',')}, ${opacity})`;
};


export const vipBadgeColors = {
  bronze: 'linear-gradient(270deg, color(display-p3 0.898 0.333 0.184) 0%, color(display-p3 0.969 0.651 0.424) 100%)',
  silver: 'linear-gradient(270deg, color(display-p3 0.545 0.608 0.655) 0%, color(display-p3 0.827 0.847 0.863) 100%)',
  gold: 'linear-gradient(270deg, color(display-p3 0.933 0.608 0.216) 0%, color(display-p3 1.000 1.000 0.353) 100%)',
  ruby: 'linear-gradient(270deg, color(display-p3 1.000 0.047 0.000) 0%, color(display-p3 0.929 0.451 0.565) 100%)',
  sapphire: 'linear-gradient(270deg, color(display-p3 0.561 0.173 0.408) 0%, color(display-p3 0.420 0.467 0.831) 100%)',
  platinum: 'linear-gradient(270deg, color(display-p3 0.086 0.094 0.114) 0%, color(display-p3 0.855 0.855 0.855) 100%)',
};
