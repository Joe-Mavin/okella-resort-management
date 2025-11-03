# 🦂 OKELLA RESORT - Brand Guidelines

## Brand Identity

**OKELLA** (meaning "Scorpion") represents strength, resilience, and the mystique of the Kenyan coast.

### Brand Story
OKELLA RESORT embodies the spirit of the scorpion - a symbol of protection, transformation, and adaptability. Just as the scorpion thrives in harsh desert environments, our resort offers an oasis of luxury in the heart of Kenya's stunning coastal landscape.

---

## Logo

The OKELLA logo features a stylized scorpion design that represents:
- **Strength & Protection**: The scorpion's powerful form
- **Luxury & Elegance**: Smooth, flowing lines
- **Coastal Heritage**: Connection to Kenya's natural beauty

### Logo Usage
- **Full Logo**: Scorpion icon + "OKELLA RESORT" text
- **Icon Only**: Scorpion symbol for favicons, social media
- **Text Only**: "OKELLA RESORT" for minimal contexts

---

## Color Palette

### Primary Colors
```css
/* Scorpion Amber/Orange - Main Brand Color */
--primary-500: #ff9500
--primary-600: #e67700
--primary-700: #cc5a00

/* Scorpion Gold - Accent Color */
--scorpion-500: #f28e1c
--scorpion-600: #d97012
--scorpion-700: #b45411
```

### Secondary Colors
```css
/* Desert Sand - Warm Neutrals */
--sand-500: #F7E9D7
--sand-600: #e5d7c5

/* Desert Sunset */
--desert-500: #ee6b1c
--desert-600: #df5012
```

### Color Psychology
- **Amber/Orange**: Energy, warmth, adventure
- **Gold**: Luxury, prestige, excellence
- **Sand**: Comfort, natural beauty, coastal elegance

---

## Typography

### Primary Font: Poppins
- **Headings**: Bold, 600-700 weight
- **Body**: Regular, 400 weight
- Modern, clean, and highly legible

### Secondary Font: Inter
- **UI Elements**: 400-500 weight
- **Captions**: 300-400 weight

---

## Brand Voice

### Tone
- **Mysterious yet Welcoming**: "Where the Spirit of the Scorpion meets Luxury"
- **Adventurous**: Emphasize unique experiences
- **Premium**: Maintain luxury positioning
- **Authentic**: Connect to Kenyan heritage

### Key Messages
1. "Experience the mystique of OKELLA"
2. "Spirit of the Scorpion"
3. "Kenya's most unique coastal paradise"
4. "Where luxury meets adventure"

---

## Visual Style

### Photography
- Warm, golden hour lighting
- Desert/coastal landscapes
- Dramatic shadows and contrasts
- Authentic Kenyan culture

### Design Elements
- Organic, flowing shapes
- Geometric patterns inspired by scorpion anatomy
- Warm gradient overlays (amber to orange)
- Desert-inspired textures

---

## Brand Applications

### Website
- Hero sections with warm overlays
- Scorpion logo in navigation
- Amber/orange CTAs and highlights
- Sand-colored backgrounds for sections

### Email Communications
- Sender: OKELLA RESORT <noreply@okellaresort.com>
- Signature: "The Spirit of the Scorpion"

### Social Media
- Hashtags: #OkellaResort #SpiritOfTheScorpion #KenyaLuxury
- Profile: Scorpion icon logo
- Cover: Coastal sunset with scorpion silhouette

---

## Contact Information

**Email**: info@okellaresort.com  
**Admin**: admin@okellaresort.com  
**Location**: Next to Bondo Technical Training Institute, Bondo-Misori Road, Bondo, Siaya County, Kenya  
**Coordinates**: 0.2450°N, 34.2750°E

---

## Technical Implementation

### Logo Component
```jsx
import Logo from './components/common/Logo'

// Full logo with text
<Logo size="default" variant="full" />

// Icon only
<Logo size="small" variant="icon" />
```

### Color Classes (Tailwind)
```jsx
// Primary colors
className="bg-primary-500 text-white"
className="text-primary-600 hover:text-primary-700"

// Scorpion gold
className="bg-scorpion-500"

// Gradients
className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600"
```

---

*Last Updated: October 2025*
*Brand Identity by OKELLA RESORT Team*
