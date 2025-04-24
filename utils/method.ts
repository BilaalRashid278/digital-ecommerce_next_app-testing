function lightenColor(hex: string, percent: number) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse to R, G, B
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    // Lighten each component
    const lighten = (c: any) => Math.min(255, c + (255 - c) * percent / 100);
    
    return `#${[
      Math.round(lighten(r)).toString(16).padStart(2, '0'),
      Math.round(lighten(g)).toString(16).padStart(2, '0'),
      Math.round(lighten(b)).toString(16).padStart(2, '0')
    ].join('')}`;
  }
  