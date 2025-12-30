# Hero Section - Advanced Animations Documentation

## 🎨 Animation Libraries Used

### 1. **GSAP (GreenSock Animation Platform)**
- **Purpose**: Complex timeline-based animations
- **Used For**:
  - Title entrance with 3D rotation effect
  - Content slide-in animation
  - Button scale-in with bounce effect

### 2. **Three.js + React Three Fiber**
- **Purpose**: 3D graphics and WebGL animations
- **Used For**:
  - Animated 3D sphere with distortion effect
  - Auto-rotating golden sphere in background
  - Adds depth and premium feel

### 3. **Framer Motion**
- **Purpose**: React-specific declarative animations
- **Used For**:
  - Background image transitions
  - Navigation arrows hover effects
  - News panel animations
  - Slider dots with layout animations
  - Floating particles effect
  - Radial gradient animations

## 🎬 Animation Breakdown

### **Hero Background**
```typescript
- Three.js 3D Sphere: Auto-rotating distorted mesh (right side)
- Framer Motion Background: Scale and fade transitions between slides
- Animated Particles: Radial gradient moving across the screen
- Diagonal Accent: Pulsing gold overlay with x-axis movement
```

### **Main Content Animations**

#### **Welcome Badge**
- Initial: Slides in from left with fade
- Hover: Scales up with background color change
- Spring physics for natural feel

#### **Title (GSAP)**
```javascript
Timeline Animation:
1. Start: opacity: 0, y: 100, rotationX: -90
2. End: opacity: 1, y: 0, rotationX: 0
Duration: 1.2s with power4.out easing
```

#### **Content Text (GSAP)**
```javascript
Timeline Animation:
1. Start: opacity: 0, x: -50
2. End: opacity: 1, x: 0
Duration: 0.8s with power3.out easing
Delay: -0.6s (overlaps with title)
```

#### **CTA Button (GSAP + Framer Motion)**
```javascript
GSAP Timeline:
- Scale from 0 to 1 with back.out easing
- Creates bounce effect

Framer Motion:
- Hover: Scale 1.05 + glowing shadow
- Tap: Scale 0.95
- Shimmer effect: Gradient moves across button infinitely
```

### **Latest News Panel**
```typescript
Container:
- Slides in from right (x: 100 → 0)
- Hover: Border glow + box shadow

News Items:
- Staggered entrance (each delayed by 0.1s)
- Hover: Slides right 5px + color change
```

### **Navigation Controls**

#### **Arrow Buttons**
```typescript
Initial: Fade in from sides (x: ±50)
Hover: Scale 1.1 + gold background + glow
Tap: Scale 0.9
```

#### **Slider Dots**
```typescript
Active Dot:
- Width: 12px → 48px (spring animation)
- Layout animation with layoutId
- Gradient fill

Inactive Dots:
- Hover: Scale 1.2 + opacity change
- Spring physics for smooth transitions
```

### **Floating Particles**
```typescript
20 particles randomly positioned
Animation per particle:
- y: 0 → -30 → 0 (floating up and down)
- opacity: 0 → 1 → 0 (fade in/out)
- scale: 0 → 1.5 → 0 (grow/shrink)
- Duration: 3-5s (randomized)
- Infinite loop with random delays
```

## 🎯 Performance Optimizations

1. **Three.js Canvas**: Limited to right side, 20% opacity
2. **Pointer Events**: Disabled on decorative elements
3. **Will-change**: Implicit via Framer Motion
4. **GPU Acceleration**: Transform-based animations
5. **Cleanup**: GSAP timelines killed on unmount

## 🎨 Timing & Easing

### **Entrance Sequence**
```
0.0s - Background fade in
0.2s - Welcome badge
0.4s - Title (GSAP)
0.6s - Content (GSAP)
0.8s - Button (GSAP)
0.4s - News panel
1.0s - Navigation arrows
1.2s - Slider dots
```

### **Easing Functions**
- **GSAP**: power4.out, power3.out, back.out(1.7)
- **Framer Motion**: easeInOut, spring physics
- **Three.js**: Linear rotation

## 🔄 Auto-Play Configuration

- **Interval**: 8 seconds per slide
- **Transition Duration**: 1.5 seconds
- **GSAP Re-trigger**: On every slide change

## 🎪 Interactive Elements

1. **Navigation Arrows**: Click to change slides
2. **Slider Dots**: Click to jump to specific slide
3. **News Items**: Hover effects + links
4. **CTA Button**: Shimmer + hover glow
5. **Three.js Sphere**: Auto-rotates with OrbitControls

## 📱 Responsive Behavior

- **Mobile**: News panel hidden, simplified animations
- **Tablet**: Reduced Three.js canvas size
- **Desktop**: Full experience with all animations

## 🚀 Future Enhancements

- [ ] Add parallax scrolling effect
- [ ] Implement mouse-follow spotlight
- [ ] Add sound effects on transitions
- [ ] Create custom cursor for hero section
- [ ] Add video background support
- [ ] Implement gesture controls for mobile

## 🛠️ Customization

### Change Animation Speed
```typescript
// In HeroSection.tsx
const interval = 8000; // Change to desired milliseconds
```

### Adjust GSAP Timeline
```typescript
tl.fromTo(titleRef.current,
  { opacity: 0, y: 100, rotationX: -90 },
  { opacity: 1, y: 0, rotationX: 0, duration: 1.2 } // Adjust duration
)
```

### Modify Three.js Sphere
```typescript
<MeshDistortMaterial
  color="#BD9B58"        // Change color
  distort={0.5}          // Adjust distortion (0-1)
  speed={2}              // Adjust animation speed
/>
```

---

**Built with**: GSAP 3.14.2 | Three.js 0.182.0 | Framer Motion 12.4.10




