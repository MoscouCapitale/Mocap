export default function Gradient001() {
  return (
    <>
      <g>
        <g>
          <g>
            <g filter="url(#blur-filter)">
              <rect
                x="-1000"
                y="-1000"
                width="4000"
                height="4000"
                fill="var(--gradient-color-1)"
              />
              <path
                d="M776 -505L-381 961L815 1213L1436 878"
                fill="var(--gradient-color-1)"
              />
              <path
                d="M2163.670658682635 -639.497005988024L829.6706586826348 -140.49700598802394L1804.670658682635 1168.5029940119762L2540.670658682635 -245.49700598802394"
                fill="var(--gradient-color-2)"
              />
              <path
                d="M1913 456L939 2090L2235 2207L2583 835"
                fill="var(--gradient-color-1)"
              />
              <path
                d="M-435.8862275449102 677.6047904191616L-600.8862275449102 1414.6047904191616L866.1137724550898 2713.604790419162L1299.11377245509 973.6047904191616"
                fill="var(--gradient-color-2)"
              />
              <path
                d="M1514.5269461077844 461.3293413173653L1.526946107784429 1483.3293413173653L1434.5269461077844 2025.3293413173653L1699.5269461077844 1816.3293413173653"
                fill="var(--gradient-color-1)"
              />
              <path
                d="M1522 1469L887 2588L1513 3359L2865 2598"
                fill="var(--gradient-color-2)"
              />
            </g>
          </g>
        </g>
      </g>
      <rect
        width="2000"
        height="2000"
        fill="var(--gradient-color-1)"
        filter="url(#noise-filter)"
      />
      <defs>
        <filter
          id="noise-filter"
          x="-800px"
          y="-800px"
          width="2800px"
          height="2800px"
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          color-interpolation-filters="linearRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0704"
            numOctaves="4"
            seed="15"
            stitchTiles="no-stitch"
            x="0"
            y="0"
            width="2000px"
            height="2000px"
            result="turbulence"
          >
          </feTurbulence>
          <feSpecularLighting
            surfaceScale="10"
            specularConstant="0.238"
            specularExponent="20"
            lighting-color="#fff"
            x="0"
            y="0"
            width="2000px"
            height="2000px"
            in="turbulence"
            result="specularLighting"
          >
            <feDistantLight azimuth="3" elevation="100">
            </feDistantLight>
          </feSpecularLighting>
        </filter>
        <filter
          id="blur-filter"
          x="-162"
          y="-162"
          width="2324"
          height="2324"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="162"
            result="effect1_foregroundBlur_1_2"
          />
        </filter>
      </defs>
    </>
  );
}
