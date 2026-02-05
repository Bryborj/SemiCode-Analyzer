export const getElementData = (z) => {
  const sequence = [
    { n: "1s", max: 2 }, { n: "2s", max: 2 }, { n: "2p", max: 6 },
    { n: "3s", max: 2 }, { n: "3p", max: 6 }, { n: "4s", max: 2 },
    { n: "3d", max: 10 }, { n: "4p", max: 6 }, { n: "5s", max: 2 },
    { n: "4d", max: 10 }, { n: "5p", max: 6 }, { n: "6s", max: 2 },
    { n: "4f", max: 14 }, { n: "5d", max: 10 }, { n: "6p", max: 6 },
    { n: "7s", max: 2 }, { n: "5f", max: 14 }, { n: "6d", max: 10 },
    { n: "7p", max: 6 }
  ];

  let remaining = z;
  let config = [];
  let lastLevel = 0;
  let valenceElectrons = 0;

  for (let sub of sequence) {
    if (remaining <= 0) break;
    let count = Math.min(remaining, sub.max);
    config.push({ label: sub.n, electrons: count });
    
    let currentLevel = parseInt(sub.n[0]);
    if (currentLevel > lastLevel) {
      lastLevel = currentLevel;
      valenceElectrons = count;
    } else if (currentLevel === lastLevel) {
      valenceElectrons += count;
    }
    remaining -= count;
  }

  return {
    z,
    configString: config.map(c => `${c.label}${c.electrons}`).join(" "),
    valenceElectrons,
    holes: 8 - valenceElectrons
  };
};

export const determineMaterial = (el1, el2) => {
  const v1 = el1.valenceElectrons;
  const v2 = el2.valenceElectrons;

  if (v1 === 4 && v2 === 4) return "Intrínseco (Aislante)";
  if ((v1 === 4 && v2 === 5) || (v1 === 5 && v2 === 4)) return "Tipo N (Exceso de electrones)";
  if ((v1 === 4 && v2 === 3) || (v1 === 3 && v2 === 4)) return "Tipo P (Exceso de huecos)";
  return "Ninguno de los anteriores";
};

export const getElectronsPerLevel = (z) => {
  const levels = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
  const sequence = [
    { n: 1, max: 2 }, { n: 2, max: 2 }, { n: 2, max: 6 },
    { n: 3, max: 2 }, { n: 3, max: 6 }, { n: 4, max: 2 },
    { n: 3, max: 10 }, { n: 4, max: 6 }, { n: 5, max: 2 },
    { n: 4, max: 10 }, { n: 5, max: 6 }, { n: 6, max: 2 },
    { n: 4, max: 14 }, { n: 5, max: 10 }, { n: 6, max: 6 },
    { n: 7, max: 2 }, { n: 5, max: 14 }, { n: 6, max: 10 },
    { n: 7, max: 6 }
  ];

  let remaining = z;
  for (let sub of sequence) {
    let currentLevel = sub.n;
    let count = Math.min(remaining, sub.max);

    if (currentLevel in levels) {
      levels[currentLevel] += count;
    }

    remaining -= count;
  }
  return levels;
};