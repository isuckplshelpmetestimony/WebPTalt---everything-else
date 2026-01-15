'use client';

import React, { useState } from 'react';

export type PainType = 'primary' | 'secondary' | 'radiation';

export interface PainLocation {
  id: string;
  area: string;
  type: PainType;
  x: number;
  y: number;
}

interface BodyDiagramProps {
  view: 'front' | 'back';
  painLocations: PainLocation[];
  onPainLocationAdd: (location: PainLocation) => void;
  onPainLocationRemove: (id: string) => void;
  className?: string;
}

const BodyDiagram: React.FC<BodyDiagramProps> = ({
  view,
  painLocations,
  onPainLocationAdd,
  onPainLocationRemove,
  className = '',
}) => {
  const [selectedPainType, setSelectedPainType] = useState<PainType>('primary');

  const handleBodyClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Only add if clicking on body area (not on existing markers)
    if (e.target === svg || (e.target as SVGElement).tagName === 'g' || (e.target as SVGElement).tagName === 'polygon' || (e.target as SVGElement).tagName === 'rect') {
      const newLocation: PainLocation = {
        id: Date.now().toString(),
        area: getAreaFromCoordinates(x, y, view),
        type: selectedPainType,
        x,
        y,
      };
      onPainLocationAdd(newLocation);
    }
  };

  const getAreaFromCoordinates = (x: number, y: number, view: 'front' | 'back'): string => {
    if (y < 12) return 'Head';
    if (y < 18) return 'Neck';
    if (y < 28 && x > 38 && x < 62) return view === 'front' ? 'Chest' : 'Upper Back';
    if (y < 28 && (x < 38 || x > 62)) return 'Shoulder';
    if (y < 38 && x > 38 && x < 62) return view === 'front' ? 'Abdomen' : 'Mid Back';
    if (y < 38 && (x < 38 || x > 62)) return 'Arm';
    if (y < 50 && x > 38 && x < 62) return view === 'front' ? 'Lower Abdomen' : 'Lower Back';
    if (y < 65 && x > 38 && x < 62) return 'Hip';
    if (y < 65 && (x < 38 || x > 62)) return 'Thigh';
    if (y < 85) return 'Leg';
    return 'Foot';
  };

  const getPainColor = (type: PainType): string => {
    switch (type) {
      case 'primary':
        return '#EF4444'; // red-500
      case 'secondary':
        return '#FBBF24'; // yellow-400
      case 'radiation':
        return '#3B82F6'; // blue-500
      default:
        return '#EF4444';
    }
  };

  const renderBody = () => {
    const bodyColor = '#E0E6EE'; // Light grey-blue
    const chestColor = '#A9B2D8'; // Desaturated purple
    const strokeColor = '#B8C0D4'; // Darker grey for outlines

    return (
      <g onClick={handleBodyClick} className="cursor-crosshair">
        {/* Head - Pentagonal */}
        <polygon
          points="45,5 50,2 55,5 55,12 45,12"
          fill={bodyColor}
          stroke={strokeColor}
          strokeWidth="0.5"
          className="hover:opacity-80"
        />

        {/* Neck - Narrow rectangular */}
        <rect
          x="47"
          y="12"
          width="6"
          height="4"
          fill={bodyColor}
          stroke={strokeColor}
          strokeWidth="0.5"
          className="hover:opacity-80"
        />

        {/* Upper Torso - Wider rectangular */}
        <rect
          x="38"
          y="16"
          width="24"
          height="8"
          fill={bodyColor}
          stroke={strokeColor}
          strokeWidth="0.5"
          className="hover:opacity-80"
        />

        {/* Chest/Upper Back Highlight (Purple) - Front view has T-shirt shape */}
        {view === 'front' ? (
          <g>
            {/* Central inverted trapezoid/triangle */}
            <polygon
              points="47,18 50,16 53,18 53,22 50,24 47,22"
              fill={chestColor}
              stroke={strokeColor}
              strokeWidth="0.5"
              className="hover:opacity-80"
            />
            {/* Left trapezoid extending to shoulder */}
            <polygon
              points="38,18 47,18 47,22 38,20"
              fill={chestColor}
              stroke={strokeColor}
              strokeWidth="0.5"
              className="hover:opacity-80"
            />
            {/* Right trapezoid extending to shoulder */}
            <polygon
              points="53,18 62,18 62,20 53,22"
              fill={chestColor}
              stroke={strokeColor}
              strokeWidth="0.5"
              className="hover:opacity-80"
            />
          </g>
        ) : (
          <rect
            x="45"
            y="18"
            width="10"
            height="6"
            fill={chestColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
        )}

        {/* Left Arm - Three trapezoidal segments */}
        <g>
          {/* Upper arm segment (widest) */}
          <polygon
            points="38,20 32,22 28,26 26,32 28,38"
            fill={bodyColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
          {/* Mid arm segment */}
          <polygon
            points="28,38 26,44 24,50 26,56"
            fill={bodyColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
          {/* Lower arm segment (narrowest) */}
          <polygon
            points="26,56 24,62 22,68 24,74"
            fill={bodyColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
        </g>

        {/* Right Arm - Three trapezoidal segments */}
        <g>
          {/* Upper arm segment (widest) */}
          <polygon
            points="62,20 68,22 72,26 74,32 72,38"
            fill={bodyColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
          {/* Mid arm segment */}
          <polygon
            points="72,38 74,44 76,50 74,56"
            fill={bodyColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
          {/* Lower arm segment (narrowest) */}
          <polygon
            points="74,56 76,62 78,68 76,74"
            fill={bodyColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
        </g>

        {/* Mid Torso - Rectangular segment */}
        <rect
          x="40"
          y="24"
          width="20"
          height="6"
          fill={bodyColor}
          stroke={strokeColor}
          strokeWidth="0.5"
          className="hover:opacity-80"
        />

        {/* Lower Torso - Wider trapezoidal segment (base for legs) */}
        <polygon
          points="38,30 62,30 64,38 36,38"
          fill={bodyColor}
          stroke={strokeColor}
          strokeWidth="0.5"
          className="hover:opacity-80"
        />

        {/* Left Leg - Four trapezoidal segments */}
        <g>
          {/* Thigh segment 1 */}
          <polygon
            points="40,38 38,42 36,48 38,54"
            fill={bodyColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
          {/* Thigh segment 2 */}
          <polygon
            points="38,54 36,60 34,66 36,72"
            fill={bodyColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
          {/* Lower leg segment 1 */}
          <polygon
            points="36,72 34,78 32,84 34,90"
            fill={bodyColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
          {/* Lower leg segment 2 / Foot */}
          <polygon
            points="34,90 32,96 30,100 36,100"
            fill={bodyColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
        </g>

        {/* Right Leg - Four trapezoidal segments */}
        <g>
          {/* Thigh segment 1 */}
          <polygon
            points="60,38 62,42 64,48 62,54"
            fill={bodyColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
          {/* Thigh segment 2 */}
          <polygon
            points="62,54 64,60 66,66 64,72"
            fill={bodyColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
          {/* Lower leg segment 1 */}
          <polygon
            points="64,72 66,78 68,84 66,90"
            fill={bodyColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
          {/* Lower leg segment 2 / Foot */}
          <polygon
            points="66,90 68,96 70,100 64,100"
            fill={bodyColor}
            stroke={strokeColor}
            strokeWidth="0.5"
            className="hover:opacity-80"
          />
        </g>
      </g>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="mb-2 flex items-center justify-center gap-2">
        <button
          onClick={() => setSelectedPainType('primary')}
          className={`px-2 py-1 text-body-xs rounded transition-colors ${
            selectedPainType === 'primary'
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
          }`}
        >
          Primary
        </button>
        <button
          onClick={() => setSelectedPainType('secondary')}
          className={`px-2 py-1 text-body-xs rounded transition-colors ${
            selectedPainType === 'secondary'
              ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
          }`}
        >
          Secondary
        </button>
        <button
          onClick={() => setSelectedPainType('radiation')}
          className={`px-2 py-1 text-body-xs rounded transition-colors ${
            selectedPainType === 'radiation'
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
          }`}
        >
          Radiation
        </button>
      </div>

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ minHeight: '256px' }}
      >
        {renderBody()}

        {/* Render pain markers */}
        {painLocations.map((location) => (
          <g key={location.id}>
            <circle
              cx={location.x}
              cy={location.y}
              r="3.5"
              fill={getPainColor(location.type)}
              stroke="white"
              strokeWidth="1.5"
              className="cursor-pointer hover:r-4 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onPainLocationRemove(location.id);
              }}
            />
            <text
              x={location.x}
              y={location.y - 6}
              fontSize="2.5"
              fill={getPainColor(location.type)}
              textAnchor="middle"
              fontWeight="bold"
              className="pointer-events-none"
            >
              {location.type === 'primary' ? 'P' : location.type === 'secondary' ? 'S' : 'R'}
            </text>
          </g>
        ))}
      </svg>

      <p className="text-body-xs text-gray-500 text-center mt-2">
        Click on body to mark pain • Click marker to remove
      </p>
    </div>
  );
};

export default BodyDiagram;
