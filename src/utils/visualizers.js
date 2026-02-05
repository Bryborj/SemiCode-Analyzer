import { getElectronsPerLevel } from "./chemistry.js";

const orbitRadii = {
    1: 30,
    2: 60,
    3: 90,
    4: 120,
    5: 150,
    6: 180 
};

const getElectronPositions = (radius, count) => {
    const positions = [];
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI;
        positions.push({
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle)
        });
    }
    return positions;
};

export const renderAtom = (containerId, atomicNumber, symbol) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const electronsByLevel = getElectronsPerLevel(atomicNumber);
    const maxLevel = Math.max(...Object.keys(electronsByLevel).map(Number));
    const viewBoxSize = (orbitRadii[maxLevel] || 180) * 2 + 40;
    const centerOffset = viewBoxSize / 2;

    let svgContent = `
        <circle cx="0" cy="0" r="15" class="fill-indigo-700" />
        <text x="0" y="5" text-anchor="middle" class="fill-white text-[10px] font-bold">${symbol}</text>
    `;

    Object.entries(electronsByLevel).forEach(([levelStr, count]) => {
        const level = parseInt(levelStr);
        if (count > 0 && orbitRadii[level]) {
            const radius = orbitRadii[level];
            const positions = getElectronPositions(radius, count);

            svgContent += `<circle cx="0" cy="0" r="${radius}" class="stroke-slate-300 stroke-[0.5px] fill-none" />`;

            positions.forEach(pos => {
                svgContent += `<circle cx="${pos.x}" cy="${pos.y}" r="5" class="fill-indigo-400 stroke-indigo-600 stroke-[1px]" />`;
            });
        }
    });

    container.innerHTML = `
        <h4 class="font-bold text-slate-800 mb-2 text-center">Átomo de ${symbol} (Z=${atomicNumber})</h4>
        <div class="w-full max-w-sm aspect-square bg-slate-50 rounded-full flex items-center justify-center relative overflow-hidden mx-auto">
            <svg viewBox="-${centerOffset} -${centerOffset} ${viewBoxSize} ${viewBoxSize}" class="w-full h-full">
                ${svgContent}
            </svg>
        </div>
    `;
};

export const renderLattice = (containerId, hostZ, dopantZ, materialType) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const gridSize = 3;
    const atoms = [];

    const centerIndex = Math.floor((gridSize * gridSize) / 2);

    for (let i = 0; i < gridSize * gridSize; i++) {
    
        const isDopant = (materialType !== "Intrínseco (Aislante)" && i === centerIndex);
        const z = isDopant ? dopantZ : hostZ;
        atoms.push({ z, isDopant });
    }
    
    const spacing = 100;
    const offsetX = 50;
    const offsetY = 50;
    const totalWidth = spacing * gridSize;
    const totalHeight = spacing * gridSize;

    let svgContent = "";

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize - 1; col++) {
            svgContent += `<line x1="${offsetX + col * spacing}" y1="${offsetY + row * spacing}" x2="${offsetX + (col + 1) * spacing}" y2="${offsetY + row * spacing}" class="stroke-slate-400 stroke-2" />`;
            
        }
    }
    for (let row = 0; row < gridSize - 1; row++) {
        for (let col = 0; col < gridSize; col++) {
            svgContent += `<line x1="${offsetX + col * spacing}" y1="${offsetY + row * spacing}" x2="${offsetX + col * spacing}" y2="${offsetY + (row + 1) * spacing}" class="stroke-slate-400 stroke-2" />`;
        }
    }

    atoms.forEach((atom, i) => {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const x = offsetX + col * spacing;
        const y = offsetY + row * spacing;
        
        const colorClass = atom.isDopant ? "fill-orange-200 stroke-orange-500" : "fill-blue-100 stroke-blue-400";
        const textClass = atom.isDopant ? "fill-orange-900" : "fill-blue-900";
        const label = atom.isDopant ? "D" : "Si";

        svgContent += `
            <circle cx="${x}" cy="${y}" r="25" class="${colorClass} stroke-2" />
            <text x="${x}" y="${y + 5}" text-anchor="middle" class="${textClass} text-xs font-bold pointer-events-none">${atom.z}</text>
        `;

    
        if (atom.isDopant) {
            if (materialType.includes("Tipo N")) {
            
                svgContent += `<circle cx="${x + 20}" cy="${y - 20}" r="4" class="fill-red-500 animate-pulse" />`;
                svgContent += `<text x="${x + 30}" y="${y - 25}" class="text-[8px] fill-red-600">e-</text>`;
            } else if (materialType.includes("Tipo P")) {
                
                
                 svgContent += `<circle cx="${x + 35}" cy="${y}" r="5" class="fill-white stroke-red-500 stroke-1 border-dashed" />`;
                 svgContent += `<text x="${x + 35}" y="${y + 15}" class="text-[8px] fill-red-600 text-center" text-anchor="middle">h+</text>`;
            }
        }
    });

    container.innerHTML = `
        <h4 class="font-bold text-slate-800 mb-2 text-center">Estructura Cristalina (${materialType})</h4>
         <div class="w-full flex justify-center bg-slate-50 rounded-xl p-4">
            <svg viewBox="0 0 ${totalWidth} ${totalHeight}" class="w-64 h-64">
                ${svgContent}
            </svg>
        </div>
        <p class="text-xs text-center text-slate-500 mt-2">
            ${materialType.includes("Tipo N") ? "Átomo donador con electrón libre" : 
              materialType.includes("Tipo P") ? "Átomo aceptor con hueco (enlace incompleto)" : 
              "Red cristalina perfecta (Silicio puro)"}
        </p>
    `;
};
