# 私人图床 PicGo Private Image Hosting

🖼️ 一个简单易用的私人图床服务，支持 PicGo 客户端上传，提供 Web 界面管理。

A simple and easy-to-use private image hosting service, compatible with PicGo client uploads, with a web management interface.

## ✨ 特性 / Features

- 📤 **简单上传** - 支持拖拽上传、点击上传
- 🖼️ **图片管理** - Web 界面查看和管理已上传的图片
- 🔗 **多格式链接** - 自动生成直链、Markdown、HTML 格式
- 🔌 **PicGo 兼容** - 完全兼容 PicGo 客户端
- 📊 **统计信息** - 实时显示图片数量和存储空间
- 🎨 **美观界面** - 现代化的渐变色 UI 设计
- 🚀 **轻量快速** - 基于 Node.js + Express，启动迅速

## 📦 安装 / Installation

### 前置要求 / Prerequisites

- Node.js >= 14.0.0
- npm 或 yarn

### 快速开始 / Quick Start

1. 克隆或下载本项目
   ```bash
   git clone <repository-url>
   cd gfsafhjnbvdskbwhedsvxvw
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 启动服务
   ```bash
   npm start
   ```

4. 访问 Web 界面
   ```
   http://localhost:3000
   ```

## 🚀 使用方法 / Usage

### Web 界面上传

1. 打开浏览器访问 `http://localhost:3000`
2. 点击上传区域或拖拽图片到上传区域
3. 预览图片后点击"上传图片"按钮
4. 复制生成的图片链接（支持直链、Markdown、HTML 格式）

### API 上传

使用 POST 请求上传图片：

```bash
curl -X POST -F "file=@/path/to/image.jpg" http://localhost:3000/upload
```

响应格式：
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "filename": "file-1234567890-123456789.jpg",
    "url": "http://localhost:3000/uploads/file-1234567890-123456789.jpg",
    "size": 102400,
    "mimetype": "image/jpeg"
  }
}
```

### PicGo 配置

在 PicGo 客户端中配置自定义上传：

1. 打开 PicGo 设置
2. 选择"自定义Web图床"
3. 配置如下：
   - **URL**: `http://localhost:3000/upload`
   - **参数名**: `file`
   - **JSON 路径**: `data.url`
   - **自定义请求头**: 留空（可选）
   - **自定义Body**: 留空

## 📚 API 文档 / API Documentation

### 上传图片
- **URL**: `/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **参数**: `file` (图片文件)
- **限制**: 最大 10MB，支持 JPG/PNG/GIF/WEBP

### 获取图片列表
- **URL**: `/api/images`
- **Method**: `GET`
- **返回**: 所有已上传图片的信息

### 删除图片
- **URL**: `/api/images/:filename`
- **Method**: `DELETE`
- **参数**: `filename` (图片文件名)

### 健康检查
- **URL**: `/health`
- **Method**: `GET`
- **返回**: 服务器状态信息

## ⚙️ 配置 / Configuration

### 环境变量

- `PORT` - 服务端口（默认: 3000）

修改端口示例：
```bash
PORT=8080 npm start
```

### 文件存储

默认情况下，图片存储在 `uploads` 目录中。你可以修改 `server.js` 中的 `uploadsDir` 变量来改变存储位置。

### 上传限制

在 `server.js` 中可以修改以下配置：
- 文件大小限制（默认 10MB）
- 允许的文件类型

## 🔒 安全建议 / Security Recommendations

1. **生产环境部署**：建议配置反向代理（如 Nginx）
2. **访问控制**：添加认证机制保护上传接口
3. **HTTPS**：使用 SSL 证书加密传输
4. **备份**：定期备份 uploads 目录
5. **防火墙**：限制只允许信任的 IP 访问

## 📝 开发 / Development

### 项目结构

```
.
├── server.js          # Express 服务器主文件
├── package.json       # 项目配置和依赖
├── public/           # 静态文件目录
│   └── index.html    # Web 界面
├── uploads/          # 图片存储目录（自动创建）
└── README.md         # 项目文档
```

### 技术栈

- **后端**: Node.js + Express
- **文件上传**: Multer
- **前端**: 原生 HTML/CSS/JavaScript
- **跨域**: CORS

## 🤝 贡献 / Contributing

欢迎提交 Issue 和 Pull Request！

## 📄 许可证 / License

MIT License

## 🙏 致谢 / Acknowledgments

感谢 [PicGo](https://github.com/Molunerfinn/PicGo) 项目的灵感。

---

**注意**: 这是一个简单的私人图床实现，适合个人或小团队使用。如需用于生产环境，请根据实际需求进行安全加固和性能优化。