export const BLACK_HOLE_SHADER = {
  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec2 resolution;
    uniform float intensity;
    varying vec2 vUv;
    
    float sdCircle(vec2 p, float r) {
      return length(p) - r;
    }
    
    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      
      float dist = length(uv);
      
      float angle = atan(uv.y, uv.x);
      float distortion = 0.4 / (dist + 0.1);
      vec2 warpedUV = vec2(
        uv.x + cos(angle) * distortion * sin(time * 0.5) * intensity,
        uv.y + sin(angle) * distortion * sin(time * 0.5) * intensity
      );
      
      float blackHoleRadius = 0.35;
      float blackHoleEdge = blackHoleRadius + 0.05;
      float blackHole = smoothstep(blackHoleRadius, blackHoleEdge, length(warpedUV));
      
      float border = smoothstep(blackHoleRadius - 0.05, blackHoleRadius, length(warpedUV)) * 
                   (1.0 - smoothstep(blackHoleRadius, blackHoleRadius + 0.1, length(warpedUV)));
      
      float innerRing = blackHoleRadius + 0.02;
      float outerRing = innerRing + 0.3;
      float ringDist = length(warpedUV);
      float ring = smoothstep(outerRing, outerRing - 0.08, ringDist) *
                   smoothstep(innerRing - 0.02, innerRing, ringDist);
      
      ring *= (0.7 + 0.3 * sin(angle * 20.0 + time));
      
      float swirl = sin(angle * 15.0 - time * 3.0) * 0.5 + 0.5;
      ring *= (0.8 + swirl * 0.4);
      
      vec3 goldColor = vec3(0.83, 0.69, 0.22);
      vec3 deepGold = vec3(0.7, 0.5, 0.1);
      vec3 whiteGold = vec3(1.0, 0.97, 0.84);
      vec3 blackColor = vec3(0.0, 0.0, 0.0);
      
      float colorMix = 0.6 + 0.4 * sin(angle * 8.0 + time);
      vec3 ringColor = mix(deepGold, goldColor, colorMix);
      
      float highlight = pow(swirl, 2.0);
      ringColor = mix(ringColor, whiteGold, highlight * 0.9);
      
      float glow = 0.03 / (pow(dist, 1.2) + 0.01);
      vec3 glowColor = mix(whiteGold, goldColor, dist) * glow * (0.7 + 0.3 * sin(time * 0.2));
      
      float sparkTime = time * 4.0;
      float sparkAngle = mod(angle + sparkTime, 6.28);
      float sparkLen = mod(dist * 12.0 + sparkTime, 6.28);
      float sparkle = pow(sin(sparkAngle * 10.0) * sin(sparkLen * 10.0), 20.0) * ring * 3.0;
      
      vec3 finalColor = ringColor * ring + glowColor + whiteGold * sparkle;
      
      finalColor *= intensity * (0.8 + 0.2 * sin(time * 0.3));
      
      finalColor = mix(blackColor, finalColor, blackHole);
      
      finalColor = mix(deepGold, finalColor, 1.0 - border * 0.7);
      
      float blackHoleAlpha = 1.0 - blackHole * 0.5;
      float ringAlpha = ring + min(glow, 0.8) + sparkle;
      float alpha = max(blackHoleAlpha, ringAlpha);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

export const PARTICLE_SHADER = {
  vertexShader: `
    attribute float size;
    attribute vec3 color;
    uniform float time;
    uniform float intensity;
    varying vec3 vColor;
    
    void main() {
      vColor = color;
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      
      float pulseFactor = 1.0 + 0.15 * sin(time + length(position) * 0.5);
      
      float dist = length(mvPosition.xyz);
      gl_PointSize = size * (20.0 / dist) * intensity * pulseFactor;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    
    void main() {
      vec2 uv = gl_PointCoord - vec2(0.5);
      float dist = length(uv);
      
      if (dist > 0.48) discard;
      
      float centerIntensity = 1.0 - smoothstep(0.0, 0.2, dist);
      float edgeIntensity = 1.0 - smoothstep(0.1, 0.48, dist);
      
      vec3 goldColor = vec3(0.83, 0.69, 0.22);
      vec3 whiteColor = vec3(1.0, 0.98, 0.9);
      
      vec3 finalColor = mix(
        mix(vColor * goldColor, whiteColor, centerIntensity), 
        vColor, 
        0.3
      );
      
      float alpha = edgeIntensity * 0.9;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};
