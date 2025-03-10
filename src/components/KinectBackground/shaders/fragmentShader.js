export const fragmentShader = `
  uniform sampler2D map;
  varying vec2 vUv;
  varying float vDepth;
  
  void main() {
    vec4 color = texture2D(map, vUv);
    
    vec3 colorScheme;
    float alpha = 0.3;
    
    if (vDepth < 0.3) {
      colorScheme = vec3(0.1, 0.08, 0.02);
      alpha = 0.2;
    } else if (vDepth < 0.5) {
      colorScheme = vec3(0.5, 0.4, 0.1);
      alpha = 0.15;
    } else if (vDepth < 0.7) {
      colorScheme = vec3(0.83, 0.69, 0.22);
      alpha = 0.2;
    } else if (vDepth < 0.9) {
      colorScheme = vec3(0.8, 0.8, 0.8);
      alpha = 0.15;
    } else {
      colorScheme = vec3(1.0, 1.0, 1.0);
      alpha = 0.2;
    }
    
    vec2 center = vec2(0.5, 0.45);
    float distance = length(gl_FragCoord.xy / vec2(1920.0, 1080.0) - center);
    float vignette = smoothstep(0.2, 1.0, distance);
    
    colorScheme = mix(colorScheme, vec3(0.0, 0.0, 0.0), vignette * 0.8);
    
    gl_FragColor = vec4(colorScheme, alpha);
  }
`;
