# 🔍 Auto-Play Debug Guide

## Current Implementation

The auto-play slider should:
1. Wait for slides to load (`loading === false`)
2. Check if there are 2+ slides
3. Start an 8-second interval
4. Advance to next slide automatically

## Debug Steps

### 1. Check Browser Console

Open browser console (F12) and look for these messages:

```
✅ "Loaded X slides for hero" - Shows how many slides loaded
✅ "Auto-play check: { slidesLength: X, loading: false }" - Initial check
✅ "Starting auto-play with X slides" - Auto-play activated
✅ "Auto-advancing slide" - Fires every 8 seconds
✅ "Moving from slide X to slide Y" - Shows slide transition
```

### 2. Check Slide Count

**If you see:**
- `"Loaded 1 slides"` or `"No news with images found"` → Need to add news articles with images
- `"Loaded 0 slides"` → Database connection issue
- `"Auto-play disabled: not enough slides"` → Need at least 2 slides

### 3. Manual Test

Try these:
1. Click the navigation arrows (< >) - Do slides change?
2. Click the dots at the bottom - Do slides change?
3. Wait 8 seconds - Does it auto-advance?

### 4. Check Network Tab

1. Open Network tab in DevTools
2. Look for API call to `/api/news` or similar
3. Check if news data is being fetched
4. Verify news items have `image` property

## Common Issues

### Issue 1: Only 1 Slide (Default)
**Symptom:** Auto-play doesn't start
**Cause:** No news with images in database
**Solution:** Add news articles with images

### Issue 2: Slides Load But Don't Auto-Advance
**Symptom:** Console shows "Starting auto-play" but no "Auto-advancing slide"
**Cause:** Interval not firing
**Solution:** Check for JavaScript errors in console

### Issue 3: `isTransitioning` Stuck
**Symptom:** Manual navigation doesn't work
**Cause:** Transition state not resetting
**Solution:** Already fixed - auto-play resets transition state

### Issue 4: Slides Change But No Animation
**Symptom:** Slides jump without transition
**Cause:** Framer Motion or GSAP not animating
**Solution:** Check animation dependencies

## Quick Test Code

Add this temporarily to see current slide number:

```tsx
{/* Debug: Current Slide Indicator */}
<div className="fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded z-50">
  Slide {currentSlide + 1} / {slides.length}
</div>
```

Add this before the closing `</div>` of the hero section to see the slide number change.

## Expected Console Output

```
Loaded 3 slides for hero
Auto-play check: { slidesLength: 3, loading: false }
Starting auto-play with 3 slides
... (after 8 seconds)
Auto-advancing slide
Moving from slide 0 to slide 1
... (after 8 seconds)
Auto-advancing slide
Moving from slide 1 to slide 2
... (after 8 seconds)
Auto-advancing slide
Moving from slide 2 to slide 0
```

## Verification Checklist

- [ ] News articles exist in database
- [ ] News articles have images
- [ ] At least 2 news articles with images
- [ ] Console shows "Loaded X slides" (X >= 2)
- [ ] Console shows "Starting auto-play"
- [ ] Console shows "Auto-advancing slide" every 8 seconds
- [ ] Visual slide changes every 8 seconds
- [ ] Manual navigation works (arrows/dots)
- [ ] Animations play on slide change

## If Still Not Working

1. **Check Database:**
   ```bash
   # Verify news in database
   # Should have at least 2 news items with image field
   ```

2. **Check API Response:**
   - Open Network tab
   - Look for news API call
   - Verify response has news with images

3. **Temporary Fix:**
   - Add multiple default slides for testing:
   ```typescript
   const [slides, setSlides] = useState([
     defaultSlide,
     { ...defaultSlide, title: "SLIDE 2", _id: "2" },
     { ...defaultSlide, title: "SLIDE 3", _id: "3" }
   ]);
   ```

4. **Check React Version:**
   - Ensure React 18+ for proper useEffect behavior
   - Check for React strict mode double-mounting

## Current Auto-Play Settings

- **Interval:** 8000ms (8 seconds)
- **Minimum Slides:** 2
- **Transition Time:** 1000ms (1 second)
- **Loop:** Yes (cycles back to first)
- **Pause on Hover:** No (continuous)
- **Reset on Manual Nav:** No (continues)




