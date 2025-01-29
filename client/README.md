# Webpage Screenshotter

## Overview
Webpage Screenshotter is a web application that allows users to capture multiple high-resolution screenshots of any website by providing a URL. The tool ensures that UI elements are clear and visible, making it useful for AI vision models, archiving content, or sharing snapshots.

## Features
- Capture multiple screenshots of a webpage, maintaining high resolution
- Customize screenshot dimensions (width and height)
- Choose between full-page or viewport screenshots
- Adjust scroll behavior and capture delay
- Download images in various formats (PNG, JPEG)
- Organize screenshots with custom naming patterns
- Preview screenshots before downloading
- Batch processing capabilities

## Technologies Used
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Screenshot Service:** Puppeteer
- **Image Processing:** Sharp
- **Storage:** Local filesystem / AWS S3 (optional)

## Screenshots

![Screenshot 1](./public/screenshot1.png)
![Screenshot 2](./public/screenshot2.png)
![Screenshot 3](./public/screenshot3.png)



## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/yourusername/webpage-screenshotter.git
cd webpage-screenshotter
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Usage

### Basic Screenshot Capture
1. Navigate to `http://localhost:3000`
2. Enter the target website URL
3. Configure screenshot options:
   - Viewport size (width x height)
   - Full page or viewport capture
   - Image format (PNG/JPEG)
   - Capture delay (in milliseconds)
4. Click "Capture Screenshot"
5. Preview and download the results

### Advanced Options
- **Batch Processing:** Upload a CSV file with multiple URLs
- **Custom Naming:** Set prefix and naming pattern for screenshots
- **Quality Settings:** Adjust image quality and compression
- **Authentication:** Capture screenshots of authenticated pages
- **Selective Capture:** Choose specific elements to capture

## API Endpoints

### Screenshot Service
```
POST /api/screenshot
GET /api/screenshots/:id
DELETE /api/screenshots/:id
```

## Deployment

### Frontend Deployment
- Vercel
- Netlify
- GitHub Pages

### Backend Deployment
- Heroku
- AWS Elastic Beanstalk
- Digital Ocean
- Railway

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
For support, please open an issue in the GitHub repository or contact the maintainers.