# Virtual Reality Room Explorer

An immersive first-person 3D room exploration experience built with React Three Fiber.

## ✨ Features

### 🎮 First-Person Controls
- **Mouse Look**: Click and drag to look around
- **Movement**: WASD or arrow keys to move
- **Zoom**: Mouse scroll wheel to zoom in/out for detail inspection
- **Human-like movement**: Realistic walking speed and constraints

### 🔍 Interactive Object System
- **Click to Explore**: Click on any object in the room to see detailed information
- **Rich Information**: Each object has:
  - Name and description
  - Technical details
  - Historical context (where applicable)
  - Category classification
- **Smart Recognition**: Advanced fuzzy matching recognizes objects even with different names

### 🏛️ Object Categories
- **Furniture**: Chairs, tables, sofas, desks, bookshelves, cabinets
- **Art**: Paintings, statues, sculptures
- **Decorative**: Vases, lamps, mirrors, clocks, candlesticks
- **Architecture**: Fireplace, windows, doors, columns, ceiling, floor
- **Textiles**: Carpets, curtains, drapes
- **Literature**: Books and manuscripts
- **Lighting**: Various period-appropriate lighting fixtures

### 📱 User Interface
- **Auto-hiding instructions**: Control hints disappear after interaction
- **Detailed info panels**: Rich object information with historical context
- **Smooth transitions**: Elegant UI animations and transitions
- **Responsive design**: Works on various screen sizes

## 🚀 How to Use

1. **Start Exploring**: Load the app and you'll see control instructions
2. **Look Around**: Click and drag with your mouse to look in any direction
3. **Move**: Use WASD keys or arrow keys to walk around the room
4. **Examine Objects**: Click on any furniture, artwork, or architectural element
5. **Read Details**: An information panel will appear with rich details about the object
6. **Zoom for Details**: Use mouse scroll to zoom in and examine fine details
7. **Continue Exploring**: Close the info panel and discover more objects

## 🛠️ Technical Implementation

### Architecture
- **React Three Fiber**: 3D rendering and interaction
- **TypeScript**: Type-safe development
- **Component-based**: Modular and maintainable code structure
- **State Management**: Clean prop drilling for object selection

### Object Information System
```typescript
// Each object has rich metadata
{
  name: "Antique Chair",
  description: "A beautifully crafted wooden chair from the Victorian era.",
  details: ["Made from solid mahogany wood", "Hand-carved decorative elements"],
  category: "Furniture",
  historicalInfo: "This style was popular in wealthy English homes during the 1870s."
}
```

### Smart Object Recognition
- **Direct matching**: Exact object name matches
- **Fuzzy matching**: Partial name recognition
- **Pattern matching**: Regex patterns for common variations
- **Fallback**: Generic information for unrecognized objects

## 🎯 User Experience Features

### Intelligent UI
- **Context-aware**: Instructions hide after user demonstrates understanding
- **Non-intrusive**: Information panels don't block navigation
- **Informative**: Rich historical and technical details
- **Accessible**: Clear typography and color contrast

### Interaction Design
- **Visual feedback**: Objects highlight on hover
- **Clear selection**: Selected objects stay highlighted
- **Smooth zoom**: Gradual FOV changes for detail inspection
- **Realistic movement**: Human-scale navigation and constraints

## 🔧 Development

### Setup
```bash
npm install
npm run dev
```

### Key Components
- `ThreeScene.tsx`: Main 3D scene container
- `CameraController.tsx`: First-person camera controls
- `InteractiveModel.tsx`: Object interaction handling
- `UI.tsx`: Information display and instructions
- `App.tsx`: State management and component coordination

### Adding New Objects
To add information for new objects, update the `objectInfoDatabase` in `UI.tsx`:

```typescript
'new_object': {
  name: 'Object Name',
  description: 'Brief description',
  details: ['Detail 1', 'Detail 2'],
  category: 'Category',
  historicalInfo: 'Optional historical context'
}
```

## 🎨 Design Philosophy

This application creates an immersive museum-like experience where users can:
- Explore at their own pace
- Learn through interaction
- Discover hidden details through close inspection
- Appreciate historical and artistic context

The interface is designed to be discoverable yet unobtrusive, allowing the 3D environment to be the primary focus while providing rich contextual information when requested.
#   V R  
 