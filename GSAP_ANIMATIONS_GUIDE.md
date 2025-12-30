# 🎬 GSAP Animations in Hero Slider

## 📋 Overview

The hero slider uses **GSAP (GreenSock Animation Platform)** to animate three main content elements on each slide change:

1. **Title** (H1 element)
2. **Description/Content** (Paragraph element)
3. **CTA Button** (Button with stats)

## 🎯 GSAP Elements

### **1. GSAP Import**
```typescript
import gsap from "gsap";
```

### **2. GSAP Refs (DOM References)**
```typescript
const titleRef = useRef<HTMLHeadingElement>(null);
const contentRef = useRef<HTMLParagraphElement>(null);
const buttonRef = useRef<HTMLDivElement>(null);
```

These refs are attached to the actual DOM elements that GSAP will animate.

### **3. GSAP Timeline**
```typescript
const tl = gsap.timeline();
```

A timeline allows sequencing multiple animations with precise timing control.

## 🎨 Six Different Animation Variants

Each slide cycles through one of **6 unique GSAP animation patterns**:

### **Variant 0: 3D Rotation from Bottom**
```typescript
{
  title: { 
    from: { opacity: 0, y: 100, rotationX: -90 }, 
    to: { opacity: 1, y: 0, rotationX: 0, duration: 1.2, ease: "power4.out" } 
  },
  content: { 
    from: { opacity: 0, x: -50 }, 
    to: { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" } 
  },
  button: { 
    from: { opacity: 0, scale: 0 }, 
    to: { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" } 
  }
}
```

**Effect:**
- Title: Flips up from below (3D rotation on X-axis)
- Content: Slides in from left
- Button: Pops in with bounce effect

---

### **Variant 1: Slide from Left with Rotation**
```typescript
{
  title: { 
    from: { opacity: 0, x: -200, rotation: -15 }, 
    to: { opacity: 1, x: 0, rotation: 0, duration: 1, ease: "power3.out" } 
  },
  content: { 
    from: { opacity: 0, y: 50, scale: 0.8 }, 
    to: { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" } 
  },
  button: { 
    from: { opacity: 0, x: -100 }, 
    to: { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" } 
  }
}
```

**Effect:**
- Title: Slides from left while rotating counter-clockwise
- Content: Slides up from below while scaling up
- Button: Slides in from left

---

### **Variant 2: Zoom In with Fade**
```typescript
{
  title: { 
    from: { opacity: 0, scale: 0.5, y: -50 }, 
    to: { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" } 
  },
  content: { 
    from: { opacity: 0, scale: 1.5 }, 
    to: { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" } 
  },
  button: { 
    from: { opacity: 0, y: 50, rotation: 10 }, 
    to: { opacity: 1, y: 0, rotation: 0, duration: 0.6, ease: "power2.out" } 
  }
}
```

**Effect:**
- Title: Zooms in from small with elastic bounce
- Content: Zooms in from large
- Button: Slides up with slight rotation

---

### **Variant 3: Slide from Right with Perspective**
```typescript
{
  title: { 
    from: { opacity: 0, x: 200, rotationY: 90 }, 
    to: { opacity: 1, x: 0, rotationY: 0, duration: 1, ease: "power4.out" } 
  },
  content: { 
    from: { opacity: 0, x: 100, skewX: 10 }, 
    to: { opacity: 1, x: 0, skewX: 0, duration: 0.8, ease: "power3.out" } 
  },
  button: { 
    from: { opacity: 0, scale: 0, rotation: 180 }, 
    to: { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)" } 
  }
}
```

**Effect:**
- Title: Flips in from right (3D rotation on Y-axis)
- Content: Slides from right with skew effect
- Button: Spins in 180° while scaling up

---

### **Variant 4: Bounce from Top**
```typescript
{
  title: { 
    from: { opacity: 0, y: -150, scale: 0.8 }, 
    to: { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "bounce.out" } 
  },
  content: { 
    from: { opacity: 0, y: -50, rotationX: 45 }, 
    to: { opacity: 1, y: 0, rotationX: 0, duration: 0.8, ease: "power3.out" } 
  },
  button: { 
    from: { opacity: 0, scale: 2 }, 
    to: { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" } 
  }
}
```

**Effect:**
- Title: Drops from top with bounce
- Content: Flips down from top (3D rotation)
- Button: Shrinks from large

---

### **Variant 5: Split and Merge**
```typescript
{
  title: { 
    from: { opacity: 0, scaleX: 0, transformOrigin: "left" }, 
    to: { opacity: 1, scaleX: 1, duration: 1, ease: "power4.out" } 
  },
  content: { 
    from: { opacity: 0, x: -100, blur: 10 }, 
    to: { opacity: 1, x: 0, blur: 0, duration: 0.8, ease: "power3.out" } 
  },
  button: { 
    from: { opacity: 0, y: 100, scaleY: 0 }, 
    to: { opacity: 1, y: 0, scaleY: 1, duration: 0.6, ease: "back.out(1.5)" } 
  }
}
```

**Effect:**
- Title: Expands horizontally from left
- Content: Slides from left with blur effect
- Button: Stretches vertically from bottom

---

## 🎬 GSAP Timeline Sequence

```typescript
const tl = gsap.timeline();

tl.fromTo(
  titleRef.current,      // Element to animate
  variant.title.from,    // Starting state
  variant.title.to       // Ending state
)
.fromTo(
  contentRef.current,
  variant.content.from,
  variant.content.to,
  "-=0.6"                // Start 0.6s before previous animation ends
)
.fromTo(
  buttonRef.current,
  variant.button.from,
  variant.button.to,
  "-=0.4"                // Start 0.4s before previous animation ends
);
```

### **Timeline Overlap:**
```
Title:   [========1.2s========]
Content:       [====0.8s====]     (starts 0.6s before title ends)
Button:            [==0.6s==]     (starts 0.4s before content ends)

Total: ~1.4s (with overlaps)
```

## 🎯 GSAP Easing Functions Used

### **Power Eases:**
- `power2.out` - Smooth deceleration
- `power3.out` - Stronger deceleration
- `power4.out` - Very strong deceleration

### **Special Eases:**
- `back.out(1.7)` - Overshoots and comes back (bounce effect)
- `back.out(2)` - Stronger overshoot
- `elastic.out(1, 0.5)` - Elastic/spring effect
- `bounce.out` - Bouncing ball effect

## 📊 Animation Properties

### **Transform Properties:**
```typescript
x: -200          // Horizontal position (pixels)
y: 100           // Vertical position (pixels)
scale: 0.5       // Overall scale (0-1+)
scaleX: 0        // Horizontal scale only
scaleY: 0        // Vertical scale only
rotation: -15    // 2D rotation (degrees)
rotationX: -90   // 3D rotation on X-axis
rotationY: 90    // 3D rotation on Y-axis
skewX: 10        // Horizontal skew (degrees)
```

### **Visual Properties:**
```typescript
opacity: 0       // Transparency (0-1)
blur: 10         // Blur effect (pixels)
```

### **Timing Properties:**
```typescript
duration: 1.2    // Animation length (seconds)
ease: "power4.out" // Easing function
```

## 🔄 How Variants Cycle

```typescript
const variant = getAnimationVariant(currentSlide);
// currentSlide % 6 determines which variant

Slide 0: Variant 0 (3D Rotation from Bottom)
Slide 1: Variant 1 (Slide from Left)
Slide 2: Variant 2 (Zoom In)
Slide 3: Variant 3 (Slide from Right)
Slide 4: Variant 4 (Bounce from Top)
Slide 5: Variant 5 (Split and Merge)
Slide 6: Variant 0 (cycles back)
...and so on
```

## 🎨 Visual Comparison

```
VARIANT 0: 3D Flip Up
     ↓
[  TITLE  ]
     ↑
   (flips)

VARIANT 1: Slide Left
←────[TITLE]

VARIANT 2: Zoom In
  ·[TITLE]·
    (grows)

VARIANT 3: Flip Right
[TITLE]────→
  (flips)

VARIANT 4: Bounce Down
     ↓
[  TITLE  ]
  (bounces)

VARIANT 5: Expand Horizontal
|→[TITLE]
 (stretches)
```

## 🎯 GSAP vs Framer Motion

In this slider:

### **GSAP Handles:**
- ✅ Title animations (H1)
- ✅ Description animations (P)
- ✅ Button animations (CTA)
- ✅ Timeline sequencing
- ✅ Complex easing functions

### **Framer Motion Handles:**
- ✅ Background image transitions
- ✅ Word-by-word title reveals
- ✅ Navigation arrows
- ✅ Slider dots
- ✅ Hover effects
- ✅ Particles
- ✅ Geometric shapes
- ✅ Floating stats cards

## 🚀 Performance

### **GSAP Benefits:**
1. **Hardware Acceleration** - Uses GPU for transforms
2. **60fps** - Optimized for smooth animations
3. **Timeline Control** - Precise sequencing
4. **Cleanup** - `tl.kill()` prevents memory leaks

### **Optimization:**
```typescript
return () => {
  tl.kill();  // Cleanup on unmount or slide change
};
```

## 🎬 Complete Animation Flow

```
1. User clicks next/prev or auto-advance triggers
2. currentSlide state updates
3. useEffect detects slide change
4. getAnimationVariant() selects pattern based on slide index
5. GSAP timeline created
6. Title animates (1.2s)
7. Content animates (0.8s, starts at 0.6s)
8. Button animates (0.6s, starts at 1.0s)
9. Total animation: ~1.4s
10. Cleanup on next change
```

## 📝 Summary

**GSAP in the slider provides:**

✅ **6 unique animation variants** that cycle through slides
✅ **Professional easing** (power, back, elastic, bounce)
✅ **3D transforms** (rotationX, rotationY)
✅ **Timeline sequencing** with overlapping animations
✅ **Smooth 60fps** performance
✅ **Automatic cleanup** to prevent memory leaks

**Each slide gets a different animation style, making the slider dynamic and engaging!** 🎉




