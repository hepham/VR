# 🔧 Hướng dẫn sửa lỗi texture từ Blender sang GLB

## 🚨 Vấn đề phổ biến

Khi export model từ Blender sang GLB, thường gặp các vấn đề:
- **Hình ảnh bị vỡ/pixelated** ở nhiều khu vực nhỏ
- **Texture bị mờ** hoặc không hiển thị đúng
- **UV mapping** bị lỗi
- **Materials không tương thích** với Three.js

## ✅ Giải pháp đã áp dụng trong code

### 1. **Texture Fixing tự động**
```typescript
// Sửa lỗi texture orientation và filtering
material.map.flipY = false          // Fix texture bị lộn ngược
material.map.generateMipmaps = true // Tạo mipmaps cho chất lượng tốt hơn
material.map.minFilter = THREE.LinearMipmapLinearFilter
material.map.magFilter = THREE.LinearFilter
```

### 2. **Material Properties Fix**
```typescript
material.side = THREE.FrontSide     // Đảm bảo faces hiển thị đúng
material.transparent = material.opacity < 1
material.alphaTest = 0.1           // Fix transparency issues
material.depthWrite = true         // Fix depth buffer issues
```

### 3. **Geometry Optimization**
```typescript
geometry.computeVertexNormals()    // Tính toán lại normals
geometry.computeBoundingBox()      // Tối ưu bounding box
```

## 🔧 Cách fix trong Blender (khuyến nghị)

### **1. UV Mapping**
- Đảm bảo tất cả objects có **proper UV mapping**
- Sử dụng **Smart UV Project** hoặc **Unwrap** thủ công
- Kiểm tra **UV overlaps** và **seams**

### **2. Texture Settings**
- **Texture size**: Sử dụng kích thước power-of-2 (512x512, 1024x1024, 2048x2048)
- **Format**: PNG hoặc JPG (tránh EXR, HDR)
- **Color space**: sRGB cho color maps, Non-Color cho normal maps

### **3. Material Nodes**
```
Principled BSDF phải kết nối với:
├── Image Texture (Base Color)
├── Image Texture (Normal) → Normal Map → Normal input
├── Image Texture (Roughness) → Roughness input
└── Image Texture (Metallic) → Metallic input
```

### **4. Export Settings**
```
GLB Export options:
✅ Include: Selected Objects
✅ Include: Active Collection  
✅ Transform: +Y Up
✅ Geometry: Apply Modifiers
✅ Geometry: UVs
✅ Geometry: Normals
✅ Materials: Export
✅ Images: Automatic
✅ Compression: None (hoặc Draco nếu cần)
```

## 🐛 Debug trong Development

### **1. Console Logging**
Code đã thêm logging để debug:
```
🔧 Fixing textures and materials...
Available materials: [list of materials]
Fixed material: [material_name] {hasMap: true, opacity: 1...}
✅ Texture fixing complete!
```

### **2. Check Browser Console**
Mở F12 → Console để xem:
- Material loading errors
- Texture loading errors  
- WebGL warnings

### **3. Three.js Inspector**
Sử dụng [Three.js Editor](https://threejs.org/editor/) để inspect GLB file

## 🚀 Performance Tips

### **1. Texture Optimization**
- **Compress textures** trước khi import vào Blender
- Sử dụng **texture atlasing** cho nhiều objects nhỏ
- **Resize textures** phù hợp với viewing distance

### **2. Material Consolidation**  
- **Merge materials** có properties giống nhau
- Sử dụng **texture baking** cho complex materials
- Giảm số lượng **draw calls**

### **3. Geometry Optimization**
- **Decimate modifier** để giảm polygon count
- **Remove doubles** vertices
- **Proper topology** cho smooth shading

## 🔄 Testing Workflow

1. **Export từ Blender** với settings ở trên
2. **Load vào Three.js** và check console
3. **Test textures** bằng cách zoom in/out  
4. **Verify UV mapping** trong browser inspector
5. **Adjust settings** nếu cần thiết

## 📞 Troubleshooting

### **Texture vẫn bị vỡ?**
1. Check UV mapping trong Blender
2. Verify texture file paths
3. Ensure texture formats are web-compatible
4. Test với texture đơn giản trước

### **Materials không hiển thị?**
1. Check material node setup
2. Verify Principled BSDF connections  
3. Test export với material đơn giản
4. Check console errors

### **Performance chậm?**
1. Reduce texture sizes
2. Use texture compression
3. Optimize geometry
4. Consider texture atlasing 