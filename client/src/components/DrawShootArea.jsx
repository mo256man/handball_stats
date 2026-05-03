import React, { useState, useEffect } from 'react';

const createSectorPath = (centerX, centerY, radius, startAngle, endAngle) => {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const startX = centerX + radius * Math.cos(startRad);
  const startY = centerY + radius * Math.sin(startRad);
  const endX = centerX + radius * Math.cos(endRad);
  const endY = centerY + radius * Math.sin(endRad);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
};

const DrawShootArea = ({
  onClick,
  onDeselect,
  width = 200,
  height = 250,
  showValue = false,
  showText = true,
  values = [],
  is7M = true,
  setIs7M
}) => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (is7M) {
      setSelected(null);
    }
  }, [is7M]);

  const handleClick = (id) => {
    if (selected === id) {
      setSelected(null);
      if (onDeselect) onDeselect();
    } else {
      // is7Mがtrueか、selectedが設定されていた場合はonDeselectを呼ぶ
      if ((is7M || selected !== null) && onDeselect) {
        onDeselect();
      }
      setSelected(id);
      if (setIs7M) {
        setIs7M(false);
      }
      if (onClick) onClick("area", id);
    }
  };

  const getFill = (id, base) => {
    if (is7M) return base;
    return selected === id ? 'orange' : base;
  };

  const get7MFill = () => (is7M ? 'orange' : 'lightyellow');

  const x0 = 15;
  const y0 = 0;
  const svgWidth = width + 2 * x0;
  const svgHeight = height + 2 * y0;
  const viewBoxW = 200 + 2 * x0;
  const viewBoxH = 150;

  const labelDefs = [
    { id: 'LW', x: 15, y: 40, text: 'LW' },
    { id: 'RW', x: 185, y: 40, text: 'RW' },
    { id: 'L6', x: 50, y: 80, text: 'L6' },
    { id: 'R6', x: 150, y: 80, text: 'R6' },
    { id: 'L9', x: 40, y: 115, text: 'L9' },
    { id: 'R9', x: 160, y: 115, text: 'R9' },
    { id: 'M6', x: 100, y: 85, text: 'M6' },
    { id: 'M9', x: 100, y: 120, text: 'M9' },
  ];

  const labelBox = (x, y, w = 48, h = 20) => ({ x: x - w / 2, y: y - h / 2, w, h });

  return (
<svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block', border: '1px solid red' }}>
  <path d={`M ${0 + x0} ${300 + y0} L ${0 + x0} ${10 + y0} L ${200 + x0} ${10 + y0} L ${200 + x0} ${300 + y0}`} fill="white" stroke="none" />

  {/* 扇形エリア */}
  <path d={createSectorPath(85 + x0, 10 + y0, 130, 90, 135)} fill={getFill("L9","lightyellow")} onClick={() => handleClick("L9")} className="shootArea"/>
  <path d={createSectorPath(85 + x0, 10 + y0, 130, 90, 135)} fill="none" stroke="black" strokeWidth="1" strokeDasharray="2,2" />
  <path d={createSectorPath(115 + x0, 10 + y0, 130, 45, 90)} fill={getFill("R9","lightyellow")} onClick={() => handleClick("R9")} className="shootArea" />
  <path d={createSectorPath(115 + x0, 10 + y0, 130, 45, 90)} fill="none" stroke="black" strokeWidth="1" strokeDasharray="2,2" />
  <path d={createSectorPath(85 + x0, 10 + y0, 90, 90, 135)} fill={getFill("L6","lightblue")} onClick={() => handleClick("L6")} className="shootArea" />
  <path d={createSectorPath(85 + x0, 10 + y0, 90, 90, 135)} fill="none" stroke="black" strokeWidth="1" strokeDasharray="2,2" />
  <path d={createSectorPath(115 + x0, 10 + y0, 90, 45, 90)} fill={getFill("R6","lightblue")} onClick={() => handleClick("R6")} className="shootArea" />
  <path d={createSectorPath(115 + x0, 10 + y0, 90, 45, 90)} fill="none" stroke="black" strokeWidth="1" strokeDasharray="2,2" />
  <path d={`M ${0 + x0} ${10 + y0} L ${85 + x0} ${10 + y0} L ${0 + x0} ${95 + y0} Z`} fill={getFill("LW","lightgreen")} onClick={() => handleClick("LW")} className="shootArea" />
  <path d={`M ${200 + x0} ${10 + y0} L ${115 + x0} ${10 + y0} L ${200 + x0} ${95 + y0} Z`} fill={getFill("RW","lightgreen")} onClick={() => handleClick("RW")} className="shootArea" />

  {/* 中央四角形（扇形より上） */}
  <rect x={75 + x0} y={70 + y0} width={50} height={30} fill={getFill("M6","lightblue")} onClick={() => handleClick("M6")} className="shootArea" />
  <rect x={75 + x0} y={70 + y0} width={50} height={30} fill="none" stroke="black" strokeWidth="1" strokeDasharray="2,2" />
  <rect x={75 + x0} y={100 + y0} width={50} height={40} fill={getFill("M9","lightyellow")} onClick={() => handleClick("M9")} className="shootArea" />
  <rect x={75 + x0} y={100 + y0} width={50} height={40} fill="none" stroke="black" strokeWidth="1" strokeDasharray="2,2" />
  <rect id="area7M" x={75 + x0} y={97 + y0} width={50} height={6} fill={get7MFill()} />
  <rect x={75 + x0} y={97 + y0} width={50} height={6} fill="none" stroke="black" strokeWidth="1" strokeDasharray="2,2" />

  {/* 半円形（最前面） */}
  <path d={`M ${25 + x0} ${10 + y0} A 60 60 0 0 0 ${85 + x0} ${70 + y0} L ${115 + x0} ${70 + y0} A 60 60 0 0 0 ${175 + x0} ${10 + y0} Z`} fill="white" stroke="black" strokeWidth="1" />

  <path d={`M 0 300 L 0 0 L ${200 + 2*x0} 0 L ${200 + 2*x0} ${300 + 2*y0} L ${200 + x0} ${300 + 2*y0} L ${200 + x0} ${y0} L ${x0} ${y0} L ${x0} ${200+y0} Z`} fill="white" stroke="none" strokeWidth="1" />
  <path d={`M ${0 + x0} ${300 + y0} L ${0 + x0} ${10 + y0} L ${200 + x0} ${10 + y0} L ${200 + x0} ${300 + y0}`} fill="none" stroke="black" strokeWidth="1" />
  <rect x={85 + x0} y={0 + y0} width={30} height={10} fill="white" stroke="black" strokeWidth="1" />

      {labelDefs.map((lbl, idx) => {
        const textValue = showValue ? (values && values[idx] !== undefined ? values[idx] : lbl.text) : lbl.text;
        const box = labelBox(lbl.x + x0, lbl.y + y0);
        const isZero = showValue && (String(textValue).trim() === '0' || String(textValue).trim() === '0%');
        return (
          <g key={`label-${lbl.id}`}>
            {showValue && (
              <rect
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                fill={isZero ? '#d3d3d3' : 'white'}
                stroke="black"
                strokeWidth={1}
                rx={4}
                ry={4}
                onClick={onClick ? (e => { e.stopPropagation(); handleClick(lbl.id); }) : undefined}
                style={{ cursor: onClick ? 'pointer' : 'default' }}
              />
            )}
            {showText && (
              <text
                x={lbl.x + x0}
                y={lbl.y + y0}
                className="shootAreaText"
                textAnchor="middle"
                dominantBaseline="middle"
                onClick={onClick ? (e => { e.stopPropagation(); handleClick(lbl.id); }) : undefined}
                style={{ cursor: onClick ? 'pointer' : 'default' }}
              >
                {textValue}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default DrawShootArea;